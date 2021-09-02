"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validations_1 = require("../middlewares/validations");
const mediaRes_controllers_1 = require("../controllers/mediaRes.controllers");
const router = express_1.default();
// MediaRes por ID
// GET - http://localhost:3000/api/media-res/:id 
router.get('/:id', validations_1.validaciones.jwt, mediaRes_controllers_1.MediaResController.getMediaRes);
// Listar productos de media res
// GET - http://localhost:3000/api/mayoristas
router.get('/', validations_1.validaciones.jwt, mediaRes_controllers_1.MediaResController.listarMediaRes);
// Actualizar producto de media res
// PUT - http://localhost:3000/api/mayoristas/:id 
router.put('/', validations_1.validaciones.jwt, mediaRes_controllers_1.MediaResController.actualizarMediaRes);
exports.default = router;
