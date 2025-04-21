const supabase = require('../config/supabase');

// Create a new financial goal
exports.createGoal = async (req, res) => {
  try {
    const {
      name,
      description,
      targetAmount,
      currentAmount,
      targetDate,
      category,
      isShared
    } = req.body;
    
    const userId = req.user.userId;

    // Validate required fields
    if (!name || !targetAmount || !targetDate || !category) {
      return res.status(400).json({ 
        error: 'Name, target amount, target date, and category are required' 
      });
    }

    // Create goal
    const { data: goal, error } = await supabase
      .from('financial_goals')
      .insert([
        {
          user_id: userId,
          name,
          description: description || '',
          target_amount: parseFloat(targetAmount),
          current_amount: parseFloat(currentAmount || 0),
          target_date: targetDate,
          category,
          is_shared: isShared || false,
          is_completed: false,
          contributions: []
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Goal creation error:', error);
      return res.status(500).json({ error: 'Failed to create financial goal' });
    }

    // If goal is shared and user has a partner, create a duplicate for the partner
    if (isShared) {
      const { data: user } = await supabase
        .from('users')
        .select('partner_id')
        .eq('id', userId)
        .single();

      if (user && user.partner_id) {
        await supabase
          .from('financial_goals')
          .insert([
            {
              user_id: user.partner_id,
              name,
              description: description || '',
              target_amount: parseFloat(targetAmount),
              current_amount: parseFloat(currentAmount || 0),
              target_date: targetDate,
              category,
              is_shared: true,
              is_completed: false,
              contributions: [],
              shared_from: goal.id
            }
          ]);
      }
    }

    res.status(201).json({ message: 'Financial goal created successfully', goal });
  } catch (error) {
    console.error('Goal creation error:', error);
    res.status(500).json({ error: 'Failed to create financial goal' });
  }
};

// Get all financial goals for current user
exports.getAllGoals = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { 
      category,
      isShared,
      isCompleted,
      sortBy = 'target_date',
      sortOrder = 'asc'
    } = req.query;

    let query = supabase
      .from('financial_goals')
      .select('*')
      .eq('user_id', userId)
      .order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply filters if they exist
    if (category) {
      query = query.eq('category', category);
    }
    
    if (isShared !== undefined) {
      query = query.eq('is_shared', isShared === 'true');
    }
    
    if (isCompleted !== undefined) {
      query = query.eq('is_completed', isCompleted === 'true');
    }

    const { data: goals, error } = await query;

    if (error) {
      console.error('Get goals error:', error);
      return res.status(500).json({ error: 'Failed to get financial goals' });
    }

    // Calculate progress for each goal
    const goalsWithProgress = goals.map(goal => {
      const progressPercentage = Math.min(
        100,
        Math.round((goal.current_amount / goal.target_amount) * 100)
      );
      
      const remaining = Math.max(0, goal.target_amount - goal.current_amount);
      
      const today = new Date();
      const targetDate = new Date(goal.target_date);
      const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
      
      let dailyAmountNeeded = 0;
      if (daysRemaining > 0 && remaining > 0) {
        dailyAmountNeeded = remaining / daysRemaining;
      }
      
      const isOverdue = daysRemaining < 0 && !goal.is_completed;
      
      return {
        ...goal,
        progress_percentage: progressPercentage,
        remaining_amount: parseFloat(remaining.toFixed(2)),
        days_remaining: Math.max(0, daysRemaining),
        is_overdue: isOverdue,
        daily_amount_needed: parseFloat(dailyAmountNeeded.toFixed(2))
      };
    });

    res.status(200).json({ 
      goals: goalsWithProgress,
      totalCount: goalsWithProgress.length
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Failed to get financial goals' });
  }
};

// Get financial goal by ID
exports.getGoalById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const { data: goal, error } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Financial goal not found' });
    }

    // Calculate progress and timeline statistics
    const progressPercentage = Math.min(
      100,
      Math.round((goal.current_amount / goal.target_amount) * 100)
    );
    
    const remaining = Math.max(0, goal.target_amount - goal.current_amount);
    
    const today = new Date();
    const targetDate = new Date(goal.target_date);
    const daysRemaining = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
    const totalDuration = Math.ceil(
      (targetDate - new Date(goal.created_at)) / (1000 * 60 * 60 * 24)
    );
    const elapsedDuration = totalDuration - Math.max(0, daysRemaining);
    const timeProgressPercentage = Math.min(
      100,
      Math.round((elapsedDuration / totalDuration) * 100)
    );
    
    let dailyAmountNeeded = 0;
    if (daysRemaining > 0 && remaining > 0) {
      dailyAmountNeeded = remaining / daysRemaining;
    }
    
    const isOverdue = daysRemaining < 0 && !goal.is_completed;
    
    // Calculate contribution metrics
    let totalContributions = 0;
    let averageContribution = 0;
    let largestContribution = 0;
    let recentContributions = [];
    
    if (goal.contributions && goal.contributions.length > 0) {
      totalContributions = goal.contributions.length;
      
      const contributionSum = goal.contributions.reduce(
        (sum, contribution) => sum + contribution.amount, 0
      );
      averageContribution = contributionSum / totalContributions;
      
      largestContribution = Math.max(...goal.contributions.map(c => c.amount));
      
      // Get recent contributions (last 5)
      recentContributions = [...goal.contributions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    }

    res.status(200).json({ 
      goal: {
        ...goal,
        progress_percentage: progressPercentage,
        time_progress_percentage: timeProgressPercentage,
        remaining_amount: parseFloat(remaining.toFixed(2)),
        days_remaining: Math.max(0, daysRemaining),
        days_total: totalDuration,
        days_elapsed: elapsedDuration,
        is_overdue: isOverdue,
        daily_amount_needed: parseFloat(dailyAmountNeeded.toFixed(2)),
        total_contributions: totalContributions,
        average_contribution: parseFloat(averageContribution.toFixed(2)),
        largest_contribution: largestContribution,
        recent_contributions: recentContributions
      }
    });
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({ error: 'Failed to get financial goal' });
  }
};

// Update financial goal
exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const {
      name,
      description,
      targetAmount,
      currentAmount,
      targetDate,
      category,
      isShared,
      isCompleted
    } = req.body;

    // Check if goal exists and belongs to user
    const { data: existingGoal, error: checkError } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (checkError || !existingGoal) {
      return res.status(404).json({ error: 'Financial goal not found' });
    }

    // Update fields that are provided
    const updates = {};
    
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (targetAmount !== undefined) updates.target_amount = parseFloat(targetAmount);
    if (currentAmount !== undefined) updates.current_amount = parseFloat(currentAmount);
    if (targetDate !== undefined) updates.target_date = targetDate;
    if (category !== undefined) updates.category = category;
    if (isShared !== undefined) updates.is_shared = isShared;
    if (isCompleted !== undefined) updates.is_completed = isCompleted;

    // Check if goal is now completed based on current amount
    if (currentAmount !== undefined && 
        parseFloat(currentAmount) >= existingGoal.target_amount && 
        !existingGoal.is_completed) {
      updates.is_completed = true;
      updates.completion_date = new Date().toISOString();
    }

    // Perform update
    const { data: updatedGoal, error } = await supabase
      .from('financial_goals')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Update goal error:', error);
      return res.status(500).json({ error: 'Failed to update financial goal' });
    }

    // If goal is shared and this update changes shared fields
    if (existingGoal.shared_from || updates.is_shared !== undefined || 
        updates.name !== undefined || updates.description !== undefined || 
        updates.target_amount !== undefined || updates.target_date !== undefined || 
        updates.category !== undefined) {
      
      // Check if user has partner
      const { data: user } = await supabase
        .from('users')
        .select('partner_id')
        .eq('id', userId)
        .single();

      if (user && user.partner_id) {
        if (existingGoal.shared_from) {
          // Update the original goal if this is a shared copy
          await supabase
            .from('financial_goals')
            .update(updates)
            .eq('id', existingGoal.shared_from);
        } else if (existingGoal.is_shared) {
          // Update any shared copies of this goal
          await supabase
            .from('financial_goals')
            .update(updates)
            .eq('shared_from', id);
        }
      }
    }

    res.status(200).json({ 
      message: 'Financial goal updated successfully', 
      goal: updatedGoal 
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Failed to update financial goal' });
  }
};

// Delete financial goal
exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if goal exists and belongs to user
    const { data: goal, error: checkError } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (checkError || !goal) {
      return res.status(404).json({ error: 'Financial goal not found' });
    }

    // Delete goal
    const { error } = await supabase
      .from('financial_goals')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Delete goal error:', error);
      return res.status(500).json({ error: 'Failed to delete financial goal' });
    }

    // If goal is shared, delete shared copies or original
    if (goal.is_shared || goal.shared_from) {
      if (goal.shared_from) {
        // This is a shared copy, check if we should delete original too
        const { data: options } = req.query;
        if (options && options.deleteOriginal) {
          await supabase
            .from('financial_goals')
            .delete()
            .eq('id', goal.shared_from);
        }
      } else {
        // This is an original, delete all shared copies
        await supabase
          .from('financial_goals')
          .delete()
          .eq('shared_from', id);
      }
    }

    res.status(200).json({ message: 'Financial goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Failed to delete financial goal' });
  }
};

// Add contribution to a goal
exports.addContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { amount, date, note } = req.body;

    if (!amount || !date) {
      return res.status(400).json({ error: 'Amount and date are required' });
    }

    // Check if goal exists and belongs to user
    const { data: goal, error: checkError } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (checkError || !goal) {
      return res.status(404).json({ error: 'Financial goal not found' });
    }

    // Create contribution record
    const contributionRecord = {
      date,
      amount: parseFloat(amount),
      note: note || '',
      created_at: new Date().toISOString()
    };

    // Update contributions list and current amount
    const updatedContributions = [...(goal.contributions || []), contributionRecord];
    const newCurrentAmount = parseFloat((goal.current_amount + parseFloat(amount)).toFixed(2));
    const isCompleted = newCurrentAmount >= goal.target_amount;

    // Update goal with new contribution and check if goal is completed
    const updates = {
      contributions: updatedContributions,
      current_amount: newCurrentAmount,
    };

    if (isCompleted && !goal.is_completed) {
      updates.is_completed = true;
      updates.completion_date = new Date().toISOString();
    }

    const { data: updatedGoal, error } = await supabase
      .from('financial_goals')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Contribution error:', error);
      return res.status(500).json({ error: 'Failed to add contribution' });
    }

    // Also update shared goal if this is a shared goal
    if (goal.is_shared) {
      const { data: user } = await supabase
        .from('users')
        .select('partner_id')
        .eq('id', userId)
        .single();

      if (user && user.partner_id) {
        // Find the partner's copy of this goal
        let partnerGoalQuery;
        
        if (goal.shared_from) {
          // This is a shared copy, update the original
          partnerGoalQuery = supabase
            .from('financial_goals')
            .update(updates)
            .eq('id', goal.shared_from);
        } else {
          // This is an original, update the shared copies
          partnerGoalQuery = supabase
            .from('financial_goals')
            .update(updates)
            .eq('shared_from', id);
        }
        
        await partnerGoalQuery;
      }
    }

    res.status(200).json({ 
      message: isCompleted ? 'Congratulations! Goal completed!' : 'Contribution added successfully', 
      goal: updatedGoal
    });
  } catch (error) {
    console.error('Contribution error:', error);
    res.status(500).json({ error: 'Failed to add contribution' });
  }
};