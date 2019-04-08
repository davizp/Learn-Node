const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    res.render('index');
}

exports.addStore = (req, res) => {
    const context = { title: 'Add Store' };
    console.log(req.name);
    res.render('editStore', context);
}

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body)).save();

    req.flash('success', `Successfully Created ${store.name}, Care to leave a review?`);
    res.redirect(`/store/${store.slug}`);
}

exports.getStores = async (req, res) => {
    const stores = await Store.find();

    res.render('stores', { title: 'Stores', stores });
}
