"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validations_1 = require("../middlewares/validations");
const cerdo_controllers_1 = require("../controllers/cerdo.controllers");
const router = express_1.default();
// Cerdo por ID
// GET - http://localhost:3000/api/cerdo/:id 
router.get('/:id', validations_1.validaciones.jwt, cerdo_controllers_1.CerdoController.getCerdo);
// Listar productos de cerdo
// GET - http://localhost:3000/api/cerdo
router.get('/', validations_1.validaciones.jwt, cerdo_controllers_1.CerdoController.listarCerdo);
// Actualizar producto de cerdo
// PUT - http://localhost:3000/api/cerdo/:id 
router.put('/', validations_1.validaciones.jwt, cerdo_controllers_1.CerdoController.actualizarCerdo);
exports.default = router;
