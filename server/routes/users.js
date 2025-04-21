const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const { authenticate } = require('../middlewares/auth');

// Send partner invitation
router.post('/invite-partner', authenticate, async (req, res) => {
  try {
    const { partnerEmail } = req.body;
    const userId = req.user.userId;

    if (!partnerEmail) {
      return res.status(400).json({ error: 'Partner email is required' });
    }

    // Check if user exists
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user already has a partner
    if (currentUser.partner_id) {
      return res.status(400).json({ error: 'You already have a partner linked to your account' });
    }

    // Check if partner exists in the system
    const { data: partnerUser, error: partnerError } = await supabase
      .from('users')
      .select('*')
      .eq('email', partnerEmail)
      .single();

    // Create invitation token
    const invitationToken = jwt.sign(
      { 
        inviterId: userId, 
        inviterEmail: currentUser.email,
        inviterName: `${currentUser.first_name} ${currentUser.last_name}`,
        partnerEmail
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Store invitation in the database
    await supabase
      .from('partner_invitations')
      .insert([
        {
          inviter_id: userId,
          inviter_email: currentUser.email,
          partner_email: partnerEmail,
          token: invitationToken,
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        }
      ]);

    // Update user with pending partner email
    await supabase
      .from('users')
      .update({ partner_email: partnerEmail })
      .eq('id', userId);

    // Send invitation email
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    let inviteUrl;
    
    if (partnerUser) {
      // If partner already has an account, send link to accept invitation
      inviteUrl = `${process.env.CLIENT_URL}/accept-invitation/${invitationToken}`;
    } else {
      // If partner doesn't have an account, send link to register
      inviteUrl = `${process.env.CLIENT_URL}/register?invitation=${invitationToken}`;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: partnerEmail,
      subject: `FinanceMate - ${currentUser.first_name} invited you to manage finances together`,
      html: `
        <h1>Partner Invitation</h1>
        <p>${currentUser.first_name} ${currentUser.last_name} has invited you to manage your finances together using FinanceMate.</p>
        <p>Please click the link below to ${partnerUser ? 'accept the invitation' : 'create an account and join'}:</p>
        <a href="${inviteUrl}" target="_blank">${partnerUser ? 'Accept Invitation' : 'Join FinanceMate'}</a>
        <p>This invitation will expire in 7 days.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: `Invitation sent to ${partnerEmail}`,
      invitationToken
    });
  } catch (error) {
    console.error('Partner invitation error:', error);
    res.status(500).json({ error: 'Failed to send partner invitation' });
  }
});

// Accept partner invitation
router.post('/accept-invitation', authenticate, async (req, res) => {
  try {
    const { invitationToken } = req.body;
    const userId = req.user.userId;

    if (!invitationToken) {
      return res.status(400).json({ error: 'Invitation token is required' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(invitationToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired invitation' });
    }

    // Check if invitation exists and is pending
    const { data: invitation, error: invitationError } = await supabase
      .from('partner_invitations')
      .select('*')
      .eq('token', invitationToken)
      .eq('status', 'pending')
      .single();

    if (invitationError || !invitation) {
      return res.status(404).json({ error: 'Invitation not found or already processed' });
    }

    // Check if invitation has expired
    if (new Date() > new Date(invitation.expires_at)) {
      return res.status(400).json({ error: 'Invitation has expired' });
    }

    // Get the current user
    const { data: currentUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the inviter
    const { data: inviter, error: inviterError } = await supabase
      .from('users')
      .select('*')
      .eq('id', invitation.inviter_id)
      .single();

    if (inviterError || !inviter) {
      return res.status(404).json({ error: 'Inviter not found' });
    }

    // Update both users with partner information
    const updates = [];
    
    updates.push(
      supabase
        .from('users')
        .update({ 
          partner_id: inviter.id,
          partner_email: inviter.email
        })
        .eq('id', currentUser.id)
    );
    
    updates.push(
      supabase
        .from('users')
        .update({ 
          partner_id: currentUser.id,
          partner_email: currentUser.email
        })
        .eq('id', inviter.id)
    );
    
    // Mark invitation as accepted
    updates.push(
      supabase
        .from('partner_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id)
    );
    
    await Promise.all(updates);

    res.status(200).json({ 
      message: 'Partner invitation accepted',
      partner: {
        id: inviter.id,
        email: inviter.email,
        firstName: inviter.first_name,
        lastName: inviter.last_name
      }
    });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({ error: 'Failed to accept invitation' });
  }
});

// Get partner info
router.get('/partner', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user with partner details
    const { data: user, error } = await supabase
      .from('users')
      .select('partner_id, partner_email')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.partner_id) {
      return res.status(200).json({ message: 'No partner linked to this account' });
    }

    // Get partner details
    const { data: partner, error: partnerError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .eq('id', user.partner_id)
      .single();

    if (partnerError || !partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.status(200).json({
      partner: {
        id: partner.id,
        email: partner.email,
        firstName: partner.first_name,
        lastName: partner.last_name
      }
    });
  } catch (error) {
    console.error('Get partner info error:', error);
    res.status(500).json({ error: 'Failed to get partner info' });
  }
});

// Remove partner link
router.post('/remove-partner', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get user with partner details
    const { data: user, error } = await supabase
      .from('users')
      .select('partner_id, partner_email')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.partner_id) {
      return res.status(400).json({ error: 'No partner linked to this account' });
    }

    const partnerId = user.partner_id;

    // Remove partner link from both users
    const updates = [];
    
    updates.push(
      supabase
        .from('users')
        .update({ 
          partner_id: null,
          partner_email: null
        })
        .eq('id', userId)
    );
    
    updates.push(
      supabase
        .from('users')
        .update({ 
          partner_id: null,
          partner_email: null
        })
        .eq('id', partnerId)
    );
    
    await Promise.all(updates);

    res.status(200).json({ message: 'Partner link removed successfully' });
  } catch (error) {
    console.error('Remove partner error:', error);
    res.status(500).json({ error: 'Failed to remove partner link' });
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const userId = req.user.userId;

    const updates = {};
    
    if (firstName) updates.first_name = firstName;
    if (lastName) updates.last_name = lastName;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No update data provided' });
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select('id, email, first_name, last_name')
      .single();

    if (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;