const moment    = require('moment')

module.exports =   {

  getterMethods: {
    created_at() {
      return moment(this.getDataValue('created_at')).tz("Asia/Shanghai").format('YYYY-MM-DD HH:mm:ss')
    },
    updated_at(){
      return moment(this.getDataValue('updated_at')).tz("Asia/Shanghai").format('YYYY-MM-DD HH:mm:ss')
    }
  },

  freezeTableName : true,
  timestamps      : true,
  underscored     : true,
  updatedAt       : 'updated_at',
  createdAt       : 'created_at',
  charset         : 'utf8mb4',
  collate         : 'utf8mb4_general_ci',
}


