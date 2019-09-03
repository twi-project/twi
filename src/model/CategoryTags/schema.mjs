import {DataTypes as t} from "sequelize"

const schema = {
  categoryId: {
    type: t.INTEGER,
    allowNull: false,
    field: "category_id"
  },
  tagId: {
    type: t.INTEGER,
    allowNull: false,
    field: "tag_id"
  }
}

export default schema