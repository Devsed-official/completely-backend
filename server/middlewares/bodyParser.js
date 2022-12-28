export const parser = async (req, res, next) => {
  try {
    // const parsedBody = JSON.parse(JSON.stringify(req.body.data));
    // console.log(req.body)
    if (req.body && req.body.data) req.body = req.body.data;
    next();
  } catch (error) {
    return res.status(400).json({ success: false, message: error.error });
  }
};
