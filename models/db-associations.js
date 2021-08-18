module.exports = () => {
  const UserModel             = require('./user-model')
  const ContentModel          = require('./content-model')
  const CategoryModel         = require('./category-model')
  const ContentSkuModel       = require('./content-sku-model')
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

  /*一对多 反*/
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
}