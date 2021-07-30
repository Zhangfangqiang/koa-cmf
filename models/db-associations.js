module.exports = () => {
  const UserModel            = require('./user-model')
  const ContentModel         = require('./content-model')
  const CategoryModel        = require('./category-model')
  const CategoryContentModel = require('./category-content-model')

  /*多对多*/
  ContentModel.belongsToMany(CategoryModel, {
    through: {
      model: CategoryContentModel,
      unique: false,
    },
    foreignKey: 'content_id', //通过外键postId
    constraints: false
  })

  ContentModel.belongsTo(UserModel,{foreignKey: 'user_id', targetKey: 'id'})


  /*多对多*/
  CategoryModel.belongsToMany(ContentModel, {
    through: {
      model: CategoryContentModel,
      unique: false,
    },
    foreignKey: 'category_id', //通过外键postId
    constraints: false
  })

  /*一对多关联子集*/
  CategoryModel.hasMany(CategoryModel, {foreignKey: 'parent_id', targetKey: 'id'});
}