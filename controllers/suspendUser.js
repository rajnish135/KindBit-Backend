import { UserModel } from '../models/UserModel.js';

export const suspendUser = async (req, res) => {

  const { userId } = req.params;
  const { suspend } = req.body; 

  try {
    const user = await UserModel.findById(userId);

    if (!user) 
    return res.status(404).json({ message: 'User not found' });

    user.isSuspended = suspend;
    await user.save();

    //Emit to the user’s socket room using string ID
    const io = req.app.get('io'); 
    io.to(user._id.toString()).emit('suspend-user', { suspended: suspend });

    res.json({ message: `User ${suspend ? 'suspended' : 'unsuspended'} successfully.` });
  } 
  catch (err) {
    console.error('Suspend user error:', err);
    res.status(500).json({ message: 'Failed to update user status' });
  }
};
