'use strict';

const __ROOT__ = global.__ROOT__;

// Modules
var requireDir, requireHelper, Sequelize, question, logger, _;

/* jshint ignore:start */
Promise = require('pinkie-promise');
/* jshint ignore:end */
Sequelize = require('sequelize');
_ = require('lodash');
requireDir = require('require-dir');
requireHelper = require('../../core/helpers/require-helper');
question = require('readline-sync').question;
logger = require('../../core/logger');

// Functions
var loadStructure, createSuperUser, importData;

/**
 * Load database structure from ./structure directory
 *
 * @return object
 */
loadStructure = () => {
  var __oModel, __model, __ref, __oTypes;

  __ref = {};

  __oTypes = require(`${__ROOT__}/core/database`).dataTypes;
  __oModel = requireDir(`${__ROOT__}/core/database/structure`);
  for (let __sModelName in __oModel) {
    __model = __oModel[__sModelName];
    if (_.isFunction(__model) === true) {
      __ref[__sModelName] = __model(__oTypes);
    }
  }
  return __ref;
};

/**
 * Create ponyFiction.js SU
 */
createSuperUser = () => {
  return new Promise((_res, _rej) => {
    var model, oUser, oContacts,
      sLogin, sEmail, sPass;

    model = require(`${__ROOT__}/core/database`);

    oUser = model(
      'user',
      require(
        `${__ROOT__}/core/database/structure/user`
      )(model.dataTypes)
    );

    oContacts = model(
      'contacts',
      require(
        `${__ROOT__}/core/database/structure/contacts`
      )(model.dataTypes)
    );

    sLogin = question('Имя пользователя: ');
    sEmail = question('Адрес эл. почты: ');
    sPass = question('Пароль: ', {
      hideEchoBack: true
    });

    oUser.create({
      login: sLogin,
      email: sEmail,
      password: require('bcryptjs').hashSync(sPass),
      registeredAt: require('moment')().format(),
      role: 3,
      status: 1
    })
    .then(() => {
      return oUser.findOne({
        where: {
          role: 3
        }
      });
    })
    .then((oResponsedData) => {
      return oContacts.create({
        userId: oResponsedData.dataValues.userId
      });
    })
    .then(() => _res())
    .catch(err => _rej(err));
  });
};

importData = (sPrefix, oConnection) => {
  return new Promise((_res, _rej) => {
    var oDataArrays, oModelsStructure, aModelsPromise, __oTypes;

    oModelsStructure = {};
    aModelsPromise = [];
    oDataArrays = requireHelper('./data');
    __oTypes = require(
      `${__ROOT__}/core/database`
    ).dataTypes;

    for (let __sModelName in oDataArrays) {
      oModelsStructure[__sModelName] = require(
        `${__ROOT__}/core/database/structure/${__sModelName}`
      )(__oTypes);
    }

    for (let __sModelName in oModelsStructure) {
      let __oModel = oModelsStructure[__sModelName];
      for (let oValues of oDataArrays[__sModelName]) {
        aModelsPromise.push(
          oConnection.define(
            `${sPrefix}${__sModelName}`, __oModel, {
              timestamps: false
          }).upsert(oValues)
        );
      }
    }
    Promise.all(aModelsPromise)
      .then(() => _res())
      .catch(err => _rej(err));
  });
};

/**
 * Create and send database structure
 *
 * @param object oDatabaseConfig
 *
 * @return Promise
 */
module.exports = (oDatabaseConfig) => {
  return new Promise((_res, _rej) => {
    var oConnection, aModelsPromise, bIsForce,
      bCreateSuperUser, __oStructure, __oModel;

    aModelsPromise = [];
    __oStructure = loadStructure();

    oConnection = new Sequelize(
      oDatabaseConfig.dbname,
      oDatabaseConfig.user,
      oDatabaseConfig.pass, {
        dialect: oDatabaseConfig.driver,
        host: oDatabaseConfig.host,
        port: oDatabaseConfig.port,
        logging: logger.info
      }
    );

    bIsForce = question(
      'Перезаписать структуру таблиц? (Y/n): '
    ) || 'y';

    bIsForce = (
      bIsForce === 'y' || bIsForce === 'yes' ||
      bIsForce === 'д' || bIsForce === 'да'
    ) ? true : false;

    if (bIsForce === false) {
      bCreateSuperUser = question(
        'Создать аккаунт администратора? (Y/n): '
      ) || 'y';
    }

    bCreateSuperUser = (
      bCreateSuperUser === 'y' || bCreateSuperUser === 'yes' ||
      bCreateSuperUser === 'д' || bCreateSuperUser === 'да'
    ) ? true : false;

    // Create models
    for (let __sModelName in __oStructure) {
      __oModel = __oStructure[__sModelName];
      aModelsPromise.push(
        oConnection.define(
          oDatabaseConfig.prefix + __sModelName, __oModel, {
            timestamps: false
          }
        ).sync({
          force: bIsForce
        })
      );
    }

    // Send database structure
    Promise.all(aModelsPromise)
      .then(() => importData(oDatabaseConfig.prefix, oConnection))
      .then(() => {
        if (bIsForce === false && bCreateSuperUser === false) {
          return _res();
        }
        return createSuperUser();
      })
      .then(() => _res())
      .catch(err => _rej(err));
  });
};
