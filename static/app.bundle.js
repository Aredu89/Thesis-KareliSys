/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _IssueList = __webpack_require__(1);

	var _IssueList2 = _interopRequireDefault(_IssueList);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var contentNode = document.getElementById('contents');

	ReactDOM.render(React.createElement(_IssueList2.default, null), contentNode); // Render the component inside the content Node

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var newIssue = {
	  id: 3, status: 'Assigned', owner: 'Ariel',
	  created: new Date('2016-08-16'), effort: 14,
	  completionDate: new Date('2016-08-30'),
	  title: 'Third issue'
	};

	var IssueList = function (_React$Component) {
	  _inherits(IssueList, _React$Component);

	  function IssueList() {
	    _classCallCheck(this, IssueList);

	    var _this = _possibleConstructorReturn(this, (IssueList.__proto__ || Object.getPrototypeOf(IssueList)).call(this));

	    _this.state = {};
	    return _this;
	  }

	  _createClass(IssueList, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      null;
	    }
	  }, {
	    key: 'cargarLista',
	    value: function cargarLista() {
	      fetch('/api/issues').then(function (res) {
	        if (res.ok) {
	          res.json().then(function (data) {
	            console.log("Get List: ", data.data);
	          });
	        } else {
	          res.json().then(function (error) {
	            console.log("Error en get list");
	          });
	        }
	      }).catch(function (error) {
	        console.log("Error: ", error);
	      });
	    }
	  }, {
	    key: 'crearRegistro',
	    value: function crearRegistro(newIssue) {
	      fetch('/api/issues', {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(newIssue)
	      }).then(function (res) {
	        if (res.ok) {
	          res.json().then(function (data) {
	            console.log("Create issue: ", data);
	          });
	        } else {
	          res.json().then(function (err) {
	            console.log("Error al cargar issue: ", err.message);
	          });
	        }
	      }).catch(function (err) {
	        console.log("Error al crear: ", err.message);
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      return React.createElement(
	        'div',
	        null,
	        React.createElement(
	          'button',
	          {
	            type: 'button',
	            className: 'btn btn-primary',
	            onClick: function onClick() {
	              return _this2.cargarLista();
	            } },
	          'Listar'
	        ),
	        React.createElement(
	          'button',
	          {
	            type: 'button',
	            className: 'btn btn-primary',
	            onClick: function onClick() {
	              return _this2.crearRegistro();
	            } },
	          'Crear'
	        )
	      );
	    }
	  }]);

	  return IssueList;
	}(React.Component);

	exports.default = IssueList;

/***/ }
/******/ ]);