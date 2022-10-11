// utils
import makeValidation from "@withvoid/make-validation";
// models
import UserModel, { USER_ROLES, USER_GENDER_OPTIONS } from "../models/User.js";
import path from "path";

const __dirname = path.resolve();
export default {
  // onGetAllUsers: async (req, res) => {
  //   try {
  //     const users = await UserModel.getUsers();
  //     return res.status(200).json({ success: true, users });
  //   } catch (error) {
  //     return res.status(500).json({ success: false, error: error });
  //   }
  // },
  onGetUserById: async (req, res) => {
    try {
      const user = await UserModel.getUserById(req.params.id);
      return res.status(200).json({ success: true, user });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  // onCreateUser: async (req, res) => {
  //   try {
  //     const validation = makeValidation((types) => ({
  //       payload: req.body,
  //       checks: {
  //         firstName: { type: types.string },
  //         lastName: { type: types.string },
  //         type: { type: types.enum, options: { enum: USER_TYPES } },
  //       },
  //     }));
  //     if (!validation.success) return res.status(400).json({ ...validation });

  //     const { firstName, lastName, type } = req.body;
  //     const user = await UserModel.createUser(firstName, lastName, type);
  //     return res.status(200).json({ success: true, user });
  //   } catch (error) {
  //     return res.status(500).json({ success: false, error: error });
  //   }
  // },
  findAndUpdateUser: async (req, res) => {
    try {
      const user = await UserModel.findAndUpdateUser(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  updateDisplayPicture: async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
      }
      var re = /(?:\.([^.]+))?$/;
      let file = req.files.displayPicture;
      let fileExt = re.exec(file.name);
      let path =
        __dirname +
        `/content/displayPictures/${req.params.id}${fileExt[0]}`;
      await file.mv(path, async (err) => {
        if (err) {
          return res.status(500).json({ success: false, error: err });
        }
        const user = await UserModel.findAndUpdateUserDisplayPicture(
          req.params.id,
          `/public/displayPictures/${req.params.id}${fileExt[0]}`
        );
        return res.status(200).json({
          success: true,
          user,
        });
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error });
    }
  },
  // onDeleteUserById: async (req, res) => {
  //   try {
  //     const user = await UserModel.deleteByUserById(req.params.id);
  //     return res.status(200).json({
  //       success: true,
  //       message: `Deleted a count of ${user.deletedCount} user.`,
  //     });
  //   } catch (error) {
  //     return res.status(500).json({ success: false, error: error });
  //   }
  // },
};
