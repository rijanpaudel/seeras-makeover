const home = async (req, res) => {
  try {
    res
      .status(200)
      .send("Sucessfully opened home using controller");
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const register = async (req, res) => {
  try {
    console.log(req.body)
    res.status(200).json({ message: req.body })
  } catch (error) {
    res.status(500).json("Server error");
  }
}

module.exports = { home, register };