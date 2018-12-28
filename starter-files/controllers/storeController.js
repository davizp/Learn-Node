const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('index');
}

exports.addStore = (req, res) => {
    const context = { title: 'Add Store' };
    console.log(req.name);
    res.render('editStore', context);
}

exports.createStore = async (req, res) => {
    const store = new Store(req.body);
    await store.save();    
    res.redirect('/');
}