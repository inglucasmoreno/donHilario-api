"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validations_1 = require("../middlewares/validations");
const pollo_controllers_1 = require("../controllers/pollo.controllers");
const router = express_1.default();
// Pollo por ID
// GET - http://localhost:3000/api/pollo/:id 
router.get('/:id', validations_1.validaciones.jwt, pollo_controllers_1.PolloController.getPollo);
// Listar productos de pollo
// GET - http://localhost:3000/api/pollo
router.get('/', validations_1.validaciones.jwt, pollo_controllers_1.PolloController.listarPollo);
// Actualizar producto de pollo
// PUT - http://localhost:3000/api/pollo/:id 
router.put('/', validations_1.validaciones.jwt, pollo_controllers_1.PolloController.actualizarPollo);
exports.default = router;
