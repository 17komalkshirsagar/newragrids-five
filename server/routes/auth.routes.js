const express = require('express');
const router = express.Router();
const { register, login, logout, userregister, userlogin, userlogout, registerPartner, registerAssociate, loginPartner, logoutPartner, loginAssociate, logoutAssociate, registerepc, loginEpc, logoutEpc } = require('../controller/auth.controller');

// admin routes
router.post('/admin/register', register);
router.post('/admin/login', login);
router.post('/admin/logout', logout);

// User routes
router.post('/user/register', userregister);
router.post('/user/login', userlogin);
router.post('/user/logout', userlogout);

// Partner routes
router.post("/partner/register", registerPartner);




router.post("/partner/login",loginPartner );
router.post("/partner/logout", logoutPartner);

// Associate routes
router.post("/associate/register", registerAssociate);
router.post("/associate/login", loginAssociate);
router.post("/associate/logout", logoutAssociate);


router.post("/EPC/register", registerepc);
router.post("/EPC/login", loginEpc);
router.post("/EPC/logout", logoutEpc);

module.exports = router;