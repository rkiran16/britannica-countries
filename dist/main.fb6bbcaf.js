// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/main.js":[function(require,module,exports) {
window.onload = function () {
  // Global Variables
  var html = document.getElementsByTagName("html")[0];
  var API = 'http://restcountries.eu/rest/v2/';
  var countries = []; // Toggle Theme

  var themeButton = document.getElementById("toggleTheme");
  var prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  var currentTheme = localStorage.getItem("theme");
  init();

  function init() {
    // Check current theme and apply
    if (currentTheme === "dark") {
      html.classList.toggle("dark-theme");
      themeButton.innerText = "Light Mode";
    } else if (currentTheme === "light") {
      html.classList.toggle("light-theme");
      themeButton.innerText = "Dark Mode";
    } // Get All Countries


    fetch("".concat(API, "all"), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      countries = data;
      constructCountryComponent(countries);
    }).catch(function (err) {
      return console.log(err);
    });
  } // construct country component


  function constructCountryComponent(data) {
    var countriesWrapper = document.getElementById('countries');
    var countriesGrid = document.getElementById('countriesGrid'); // check to see if country card div exists
    // if so delete element

    if (countriesGrid) {
      countriesGrid.remove();
    }

    countriesGrid = document.createElement('div');
    countriesGrid.setAttribute('id', 'countriesGrid');
    countriesGrid.setAttribute('class', 'countries-grid');
    data.map(function (country) {
      var countryDiv = document.createElement('div');
      countryDiv.setAttribute('class', 'country-card');
      countryDiv.setAttribute('data-id', country.name); // Flag

      var flag = document.createElement('img');
      flag.setAttribute('src', country.flag);
      flag.setAttribute('alt', country.name); // Country Content Div

      var contentDiv = document.createElement('div');
      contentDiv.setAttribute('class', 'content'); // Country Name

      var title = document.createElement('h3');
      title.innerText = country.name;
      contentDiv.appendChild(title); // Country Population

      var population = document.createElement("p");
      population.innerHTML = "<strong>Population: </strong>".concat(country.population);
      contentDiv.appendChild(population); // Country Region

      var region = document.createElement('p');
      region.innerHTML = "<strong>Country: </strong>".concat(country.region);
      contentDiv.appendChild(region); // Country Capital

      var capital = document.createElement('p');
      capital.innerHTML = "<strong>Capital: </strong>".concat(country.capital);
      contentDiv.appendChild(capital); // Append Children to Parent

      countryDiv.appendChild(flag);
      countryDiv.appendChild(contentDiv);
      countriesGrid.appendChild(countryDiv);
    });
    countriesWrapper.appendChild(countriesGrid);
  } // Search Input Change Handler


  var searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', function (event) {
    if (event.target.value && event.target.value !== "") {
      var searchTerm = event.target.value.toLowerCase();
      var filteredData = countries.filter(function (country) {
        return country.name.toLowerCase().includes(searchTerm);
      });

      if (filteredData) {
        constructCountryComponent(filteredData);
      }
    } else {
      constructCountryComponent(countries);
    }
  }); // Region Filter Change Handler

  var filter = document.getElementsByClassName('select-items')[0];
  filter.addEventListener('click', function (event) {
    if (event.target.innerText && event.target.innerText !== "Reset") {
      var _filter = event.target.innerText.toLowerCase();

      var filteredData = countries.filter(function (country) {
        return country.region.toLowerCase() === _filter;
      });

      if (filteredData) {
        constructCountryComponent(filteredData);
      }
    } else {
      constructCountryComponent(countries);
    }
  }); // get country details

  var gridItem = document.getElementById('countries');
  gridItem.addEventListener('click', function (event) {
    if (event.target && event.target.hasAttribute('data-id')) {
      var currentTarget = event.target.getAttribute('data-id');
      var countryDetails = countries.find(function (country) {
        return country.name === currentTarget;
      });

      if (countryDetails) {
        var countryDetailsDiv = document.getElementById('countryDetails');
        countryDetailsDiv.setAttribute('class', 'country-details'); //country container

        var countryContainer = document.createElement('div');
        countryContainer.setAttribute('class', 'country-container'); // Back Button

        var backButton = document.createElement('button');
        backButton.innerHTML = "<i class=\"fas fa-arrow-left\"></i>  Back";
        backButton.setAttribute('class', 'back-btn');
        backButton.addEventListener('click', function (event) {
          html.classList.remove('video-details-open');
          countryDetailsDiv.classList.remove('country-details');
          countryDetailsDiv.innerHTML = " ";
        });
        countryContainer.appendChild(backButton); // Country Details wrapper

        var countryDetailsWrapperDiv = document.createElement('div');
        countryDetailsWrapperDiv.setAttribute('class', 'video-details-wrapper'); // Country Flag

        var flag = document.createElement('img');
        flag.setAttribute('src', countryDetails.flag); // Country Details

        var contentDiv = document.createElement('div');
        contentDiv.setAttribute('class', 'content'); // Title

        var title = document.createElement('h2');
        title.innerText = countryDetails.name; // Border Countries

        var borders = document.createElement('div');
        borders.setAttribute('class', 'borders'); // border title

        var bordersTitle = document.createElement('span');
        bordersTitle.innerHTML = '<strong>Border Countries: </strong>';
        borders.appendChild(bordersTitle);
        countryDetails["borders"].map(function (border) {
          var borderDiv = document.createElement('div');
          borderDiv.innerText = border;
          borderDiv.setAttribute('class', 'border');
          borders.appendChild(borderDiv);
        }); //Country Info

        var countryInfoDiv = document.createElement('div');
        countryInfoDiv.setAttribute('class', 'country-info'); //Country LHS

        var infoLHS = document.createElement('div');
        infoLHS.setAttribute('class', 'info-lhs'); // Native Name

        var nativeName = document.createElement('span');
        nativeName.innerHTML = "<strong>Native Name : </strong> ".concat(countryDetails.nativeName); // Population

        var population = document.createElement('span');
        population.innerHTML = "<strong>Population : </strong> ".concat(countryDetails.population); // Region

        var region = document.createElement('span');
        region.innerHTML = "<strong>Region : </strong> ".concat(countryDetails.region); // Sub Region

        var subRegion = document.createElement('span');
        subRegion.innerHTML = "<strong>Sub Region : </strong> ".concat(countryDetails.subregion); // Capital

        var capital = document.createElement('span');
        capital.innerHTML = "<strong>Capital : </strong> ".concat(countryDetails.capital);
        infoLHS.appendChild(nativeName);
        infoLHS.appendChild(population);
        infoLHS.appendChild(region);
        infoLHS.appendChild(subRegion);
        infoLHS.appendChild(capital); //Country RHS

        var infoRHS = document.createElement('div');
        infoRHS.setAttribute('class', 'info-rhs'); // Domain

        var domain = document.createElement('span');
        domain.innerHTML = "<strong>Top Level Domain : </strong> ".concat(countryDetails.topLevelDomain[0]); // currency

        var currency = document.createElement('span');
        currency.innerHTML = "<strong>Currencies : </strong> ".concat(countryDetails.currencies[0].name); // Languages

        var languages = document.createElement('span');
        languages.innerHTML = "<strong>Languages : </strong> ".concat(countryDetails.languages[0].name);
        infoRHS.appendChild(domain);
        infoRHS.appendChild(currency);
        infoRHS.appendChild(languages);
        countryInfoDiv.appendChild(infoLHS);
        countryInfoDiv.appendChild(infoRHS); //add Title and other content to Content Div

        contentDiv.appendChild(title);
        contentDiv.appendChild(countryInfoDiv);
        contentDiv.appendChild(borders);
        countryDetailsWrapperDiv.appendChild(flag);
        countryDetailsWrapperDiv.appendChild(contentDiv);
        countryContainer.appendChild(countryDetailsWrapperDiv);
        countryDetailsDiv.appendChild(countryContainer);
        html.classList.toggle('video-details-open');
      }
    }
  }); // Toggle Themes Button handler

  themeButton.addEventListener('click', function () {
    // Then toggle (add/remove) the .dark-theme class to the body
    var theme = "";

    if (prefersDarkScheme.matches) {
      html.classList.toggle("light-theme");
      theme = html.classList.contains("light-theme") ? "light" : "dark";
    } else {
      html.classList.toggle("dark-theme");
      theme = html.classList.contains("dark-theme") ? "dark" : "light";
    }

    if (html.classList.contains('dark-theme')) {
      themeButton.innerText = "Light Mode";
    } else {
      themeButton.innerText = "Dark Mode";
    }

    localStorage.setItem("theme", theme);
  });
};
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50617" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.fb6bbcaf.js.map