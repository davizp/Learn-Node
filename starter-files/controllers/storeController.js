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
};

exports.addStore = (req, res) => {
    const context = { title: 'Add Store' };

    res.render('editStore', context);
};

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

    req.body.author = req.user._id;

    const store = await (new Store(req.body)).save();

    req.flash('success', `Successfully Created ${store.name}, Care to leave a review?`);
    res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
    const stores = await Store.find();

    res.render('stores', { title: 'Stores', stores });
}

const confirmOwner = (store, user) => {
    if(!store.author.equals(user._id)) {
        throw Error('You must own a store in order to edit it!');
    }
};

exports.editStore = async (req, res) => {

    const store = await Store.findOne({ _id: req.params.id});

    // TODO: confirm they are the owner of the store
    confirmOwner(store, req.user);

    const context = {
        title: `Edit ${store.name}`,
        store
    };

    res.render('editStore', context);
};


exports.updateStore = async (req, res) => {

    req.body.location.type = 'Point';

    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, // return the new store instead of the old one
        runValidator: true,
    }).exec();

    req.flash('success', `Successfully updated <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store -></a>`);

    res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async (req, res, next) => {

    const store = await Store.findOne({ slug: req.params.slug }).populate('author');

    if(!store) {
        return next();
    }



    res.render('store', { store, title: store.name });
};

exports.getStoresByTag = async (req, res, next) => {

    const showAllTags = { $exists: true };

    const tag = req.params.tag;

    const promises = {
        tags: Store.getTagsList(),
        stores: Store.find({ tags: tag || showAllTags })
    };

    const [ tags, stores ] = await Promise.all([
        promises.tags,
        promises.stores,
    ]);

    res.render('tag', { tags, title: 'Tags', tag, stores });
};

exports.searchStores =  async (req, res) => {
    const stores = await Store
        .find(
            { $text: { $search: req.query.q }},
            { score: { $meta: 'textScore'}}
        ).sort(
            { score: { $meta: 'textScore' }}
        )
        .limit(5);

    res.json(stores);
};

exports.mapStores = async (req, res) => {
    const { lng = '', lat = '' } = req.query;
    const coordinates = [lng, lat].map(parseFloat);
    const query = {
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates
                },
                $maxDistance: 10000 // 10km
            }
        }
    };

    const stores = await Store
        .find(query)
        .select('slug name description location')
        .limit(10);

    res.json(stores);
};