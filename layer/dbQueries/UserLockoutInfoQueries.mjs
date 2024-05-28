import UserLockoutModel from '../models/userLockout.mjs';

class UserLockoutInfoQueries {
  addUserWithCounter = async (username) => {
    try {
      const User = new UserLockoutModel({
        user_name: username, 
        attempt_counter: 1
      });
      await User.save();
    } catch (error) {
      console.log("-13error", error);
      throw error;
    }
  };

  updateUserWithCounter = async (username) => {
    try {
      await UserLockoutModel.update({ user_name: username}, {
        attempt_counter: ':inc 1'
      });
    } catch (error) {
      throw error;
    }
  };

  deleteUser = async (username) => {
    try {
      await UserLockoutModel.delete({ user_name: username});
    } catch (error) {
      console.log("32-errorqry", error);
      throw error;
    }
  };

  getUserDetails = async (username) => {
    try {
      const result = await UserLockoutModel.scan({
        user_name: username
      }).all().exec();
      // const result = await UserLockoutModel.scan().all().exec();
      if (result.toJSON().length > 0) {
        return result.toJSON();
      }
      return [];
    } catch (error) {
       console.log("46-errorqry", error);
      return error;
    }
  };
}

export default UserLockoutInfoQueries;
