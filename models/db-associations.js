module.exports = () => {
  const UserModel             = require('./user-model')
  const NavItemModel          = require('./nav-item-model')
  const ContentModel          = require('./content-model')
  const CategoryModel         = require('./category-model')
  const ContentSkuModel       = require('./content-sku-model')
  const ContentCartModel      = require('./content-cart-model')
  const ContentAttrKeyModel   = require('./content-attr-key-model')
  const CategoryContentModel  = require('./category-content-model')
  const ContentAttrValueModel = require('./content-attr-value-model')

  /*多对多*/
  ContentModel.belongsToMany(CategoryModel, {
    through: {
      model: CategoryContentModel,
      unique: false,
    },
    foreignKey: 'content_id', //通过外键postId
    constraints: false
  })

  /*反向*/
  ContentModel.belongsTo(UserModel,{foreignKey: 'user_id', targetKey: 'id'})

  /*一对多 正*/
  ContentModel.hasMany(ContentAttrKeyModel, {foreignKey: 'content_id', targetKey: 'id'})

  /*一对多 正*/
  ContentModel.hasMany(ContentSkuModel, {foreignKey: 'content_id', targetKey: 'id'})

  /*多对多*/
  CategoryModel.belongsToMany(ContentModel, {
    through: {
      model: CategoryContentModel,
      unique: false,
    },
    foreignKey: 'category_id', //通过外键postId
    constraints: false
  })

  /*一对多 正*/
  CategoryModel.hasMany(CategoryModel, {foreignKey: 'parent_id', targetKey: 'id'});

  /*一对多 正*/
  ContentAttrKeyModel.hasMany(ContentAttrValueModel, {foreignKey: 'attr_key_id', targetKey: 'id'});

  /*反向*/
  NavItemModel.belongsTo(CategoryModel,{foreignKey: 'category_id', targetKey: 'id'})

  /*多对多*/
  NavItemModel.belongsToMany(ContentModel, {
    through: {
      model: CategoryContentModel,
      unique: false,
    },
    sourceKey:'category_id',    //NavItemModel.category_id
    foreignKey: 'category_id',  //通过外键postId
    constraints: false
  })

  /*一对多正向*/
  NavItemModel.hasMany(CategoryContentModel, {sourceKey:'category_id', foreignKey: 'category_id'})

  /*一对一*/
  CategoryContentModel.hasOne(ContentModel, {sourceKey: 'content_id', foreignKey: 'id'})

  /*反向*/
  ContentCartModel.belongsTo(ContentSkuModel,{foreignKey: 'content_sku_id', targetKey: 'id'})

  /*反向*/
  ContentCartModel.belongsTo(ContentModel,{foreignKey: 'content_id', targetKey: 'id'})

}