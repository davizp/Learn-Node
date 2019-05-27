const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');

        if(isPhoto) {
            next(null, true);
        } else {
            next({ message: 'That filetype isn\'t allowed!' }, false);
        }
    }
};

exports.homePage = (req, res) => {
    res.render('index');
}

exports.addStore = (req, res) => {
    const context = { title: 'Add Store' };

    res.render('editStore', context);
}

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
    if (!req.file) {
        next();
        return;
    }

    const extension = req.file.mimetype.split('/')[1];

    req.body.photo = `${uuid.v4()}.${extension}`;

    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);

    next();
};

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body)).save();

    req.flash('success', `Successfully Created ${store.name}, Care to leave a review?`);
    res.redirect(`/store/${store.slug}`);
}

exports.getStores = async (req, res) => {
    const stores = await Store.find();

    res.render('stores', { title: 'Stores', stores });
}

exports.editStore = async (req, res) => {
    // TODO: confirm they are the owner of the store
    const store = await Store.findOne({ _id: req.params.id});
    const context = {
        title: `Edit ${store.name}`,
        store
    };

    res.render('editStore', context);
}


exports.updateStore = async (req, res) => {

    req.body.location.type = 'Point';

    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return the new store instead of the old one
        runValidator: true,
    }).exec();

    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store -></a>`);

    res.redirect(`/stores/${store._id}/edit`);
}

exports.getStoreBySlug = async (req, res, next) => {

    const store = await Store.findOne({ slug: req.params.slug });

    if(!store) {
        return next();
    }



    res.render('store', { store, title: store.name });
}