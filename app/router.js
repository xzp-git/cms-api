'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.resources('entity', '/entity', controller.entity)
  router.resources('menu', '/menu', controller.menu)
};
