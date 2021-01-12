const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');

const idLength = 8;

/**
 * @swagger
 * components:
 *  schemas:
 *    item:
 *      type: object
 *      required:
 *        - words
 *        - name
 *      properties:
 *        id:
 *          type: string
 *          description: The auto-generated id of the item
 *        words:
 *          type: string
 *          description: The item words
 *        name:
 *          type: string
 *          description: The item name
 *      example:
 *        id: y34hrj43jb43bjt3434jt
 *        words: random one
 *        name: damengrandom
 */

/**
 * @swagger
 * tags:
 *  name: Items
 *  description: The item managing API
 */

/**
 * @swagger
 * /items:
 *  get:
 *    summary: Returns the list of all the items
 *    tags: [Items]
 *    responses:
 *      200:
 *        description: The list of the items
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/item'
*/

router.get('/', (req, res) => {
  const items = req.app.db.get("items");
  res.send(items);
});

/**
 * @swagger
 * /items/{id}:
 *  get:
 *    summary:
 *    tags: [Items]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The item id
 *    responses:
 *      200:
 *        description: The item description by id
 *        contents:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/item'
 *      404:
 *        description: The item was not found
 */

router.get('/:id', (req, res) => {
  const item = req.app.db.get("items").find({ id: req.params.id }).value();
  if (!item) {
    res.sendStatus(404);
  }
  res.send(item);
});

/**
 * @swagger
 * /items:
 *  post:
 *    summary: Create a new item
 *    tags: [Items]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/item' 
 *    responses:
 *      200:
 *        description: The item was successfully created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/item'
 *      500:
 *        description: Some server error
 */

router.post('/', (req, res) => {
  try {
    const item = {
      id: nanoid(idLength),
      ...req.body
    }

    req.app.db.get("items").push(item).write();
    res.send(item);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 * /items/{id}:
 *  put:
 *    summary: Update the item by the id
 *    tags: [Items]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The item id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/item'
 *    responses:
 *      200:
 *        description: The item was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/item'
 *      404:
 *        description: The item was not found
 *      500:
 *        description: Server error, cannot the record update for now
 */

router.put('/:id', (req, res) => {
  try {
    req.app.db.get("items").find({ id: req.params.id }).assign(req.body).write();
    res.send(req.app.db.get("items").find({ id: req.params.id }));
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 * /items/{id}:
 *  delete:
 *    summary: Remove the item by id
 *    tags: [Items]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The item id
 *    responses:
 *      200:
 *        description: The item was deleted successfully
 *      404:
 *        description: The item was not found
 */

router.delete('/:id', (req, res) => {
  try {
    req.app.db.get("items").remove({ id: req.params.id }).write();
    res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
