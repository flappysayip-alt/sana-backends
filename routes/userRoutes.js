const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// check if user exists
router.post('/check', async (req,res)=>{
  const { phone } = req.body;
  const user = await User.findOne({ phone });
  res.json({ exists: !!user });
});

// register (basic - called after OTP & setpassword route handles final)
router.post('/register', async (req,res)=>{
  const { name, email, phone } = req.body;
  try {
    const u = await User.findOne({ phone });
    if(u) return res.json({ success:false, error:'User exists' });
    const newUser = new User({ name, email, phone, addresses: [] });
    await newUser.save();
    res.json({ success:true });
  } catch(err){ res.status(500).json({ success:false, error:err.message }); }
});

// set password (used by user-otp after OTP verifies)
router.post('/setpassword', async (req,res)=>{
  const { phone, password, name, email } = req.body;
  try {
    let user = await User.findOne({ phone });
    const hashed = await bcrypt.hash(password, 10);

    if(!user){
      // create user
      user = new User({ name, email, phone, passwordHash: hashed, addresses: [] });
      await user.save();
      return res.json({ success:true, created:true });
    } else {
      user.passwordHash = hashed;
      user.name = name || user.name;
      user.email = email || user.email;
      await user.save();
      return res.json({ success:true });
    }
  } catch(e){ res.status(500).json({ success:false, error:e.message }); }
});

// login with phone + password
router.post('/login', async (req,res)=>{
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone });
    if(!user) return res.json({ success:false });

    const ok = await bcrypt.compare(password, user.passwordHash || '');
    if(!ok) return res.json({ success:false });

    res.json({ success:true, name: user.name, email: user.email });
  } catch(e){ res.status(500).json({ success:false, error:e.message }); }
});

// add address (max 3)
router.post('/addAddress', async (req,res)=>{
  const { phone, title, house, street, area, city, pincode, contactPhone, note, fullAddress, addressId } = req.body;
  try {
    const user = await User.findOne({ phone });
    if(!user) return res.json({ success:false, error:'User not found' });

    if(addressId){
      // edit existing
      const a = user.addresses.id(addressId);
      if(!a) return res.json({ success:false, error:'Address not found' });
      a.title = title; a.house=house; a.street=street; a.area=area; a.city=city; a.pincode=pincode; a.contactPhone=contactPhone; a.note=note; a.fullAddress=fullAddress;
    } else {
      if(user.addresses.length >= 3) return res.json({ success:false, error:'Max 3 addresses allowed' });
      user.addresses.push({ title, house, street, area, city, pincode, contactPhone, note, fullAddress });
    }
    await user.save();
    res.json({ success:true });
  } catch(e){ res.status(500).json({ success:false, error:e.message }); }
});

// get addresses
router.get('/addresses/:phone', async (req,res)=>{
  const phone = req.params.phone;
  const user = await User.findOne({ phone });
  if(!user) return res.json([]);
  res.json(user.addresses);
});

// get single address by id (for editing)
router.get('/address/:phone/:addressId', async (req,res)=>{
  const { phone, addressId } = req.params;
  const user = await User.findOne({ phone });
  if(!user) return res.json({ success:false });
  const a = user.addresses.id(addressId);
  if(!a) return res.json({ success:false });
  res.json({ success:true, address: a });
});

// ===============================
// GET CURRENT LOGGED-IN USER
// ===============================
router.get("/me", (req, res) => {
  if (!req.user) {
    return res.json({ loggedIn: false });
  }

  res.json({
    loggedIn: true,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    photo: req.user.photo || ""
  });
});

module.exports = router;

