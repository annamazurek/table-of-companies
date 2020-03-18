!function(I){var n={};function c(g){if(n[g])return n[g].exports;var t=n[g]={i:g,l:!1,exports:{}};return I[g].call(t.exports,t,t.exports,c),t.l=!0,t.exports}c.m=I,c.c=n,c.d=function(I,n,g){c.o(I,n)||Object.defineProperty(I,n,{enumerable:!0,get:g})},c.r=function(I){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(I,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(I,"__esModule",{value:!0})},c.t=function(I,n){if(1&n&&(I=c(I)),8&n)return I;if(4&n&&"object"==typeof I&&I&&I.__esModule)return I;var g=Object.create(null);if(c.r(g),Object.defineProperty(g,"default",{enumerable:!0,value:I}),2&n&&"string"!=typeof I)for(var t in I)c.d(g,t,function(n){return I[n]}.bind(null,t));return g},c.n=function(I){var n=I&&I.__esModule?function(){return I.default}:function(){return I};return c.d(n,"a",n),n},c.o=function(I,n){return Object.prototype.hasOwnProperty.call(I,n)},c.p="",c(c.s=0)}([function(module,exports,__webpack_require__){"use strict";eval('\r\n\r\nconst table = document.querySelector(".table__body--js");\r\nconst form = document.querySelector(".form--js");\r\nconst searchCompany = document.getElementById("filter");\r\nconst select = document.querySelector(".form__select--js");\r\nconst pagination = document.querySelector(".pagination--js");\r\n\r\nlet state = {\r\n  companiesData: [],\r\n  filteredCompanies: [],\r\n  page: 0,\r\n  perPage: 10,\r\n  loaded: false\r\n};\r\n\r\nif (!state.loaded) {\r\n  table.innerHTML = `<tr><td colspan="4" class="loader"><div class="loader__item"></div></td></tr>`;\r\n}\r\n\r\nsearchCompany.onkeypress = handleKeypress;\r\nform.onsubmit = handleSubmit;\r\nselect.onchange = handleSelect;\r\n\r\nfunction handleKeypress(e) {\r\n  setTimeout(() => {\r\n    let userInput = e.target.value;\r\n    state.filteredCompanies = state.companiesData.filter(company =>\r\n      company.name.toLowerCase().includes(userInput.toLowerCase())\r\n    );\r\n    state.page = 0;\r\n    showData(state.filteredCompanies);\r\n  }, 1000);\r\n}\r\n\r\nfunction handleSelect(e) {\r\n  state.page = 0;\r\n  state.perPage = parseInt(e.target.value);\r\n  showData(state.companiesData);\r\n}\r\n\r\nfunction handleSubmit(e) {\r\n  e.preventDefault();\r\n}\r\n\r\nfunction fetchData() {\r\n  fetch("https://recruitment.hal.skygate.io/companies")\r\n    .then(res => res.json())\r\n    .then(data => {\r\n      const dataLength = data.length;\r\n      data.map(company => {\r\n        fetch("https://recruitment.hal.skygate.io/incomes/" + company.id)\r\n          .then(res => res.json())\r\n          .then(res => {\r\n            const companyIncome = res.incomes\r\n              .map(income => parseFloat(income.value))\r\n              .reduce((a, b) => a + b);\r\n\r\n            state.companiesData.push({\r\n              id: company.id,\r\n              name: company.name,\r\n              city: company.city,\r\n              income: companyIncome.toFixed(2)\r\n            });\r\n            if (state.companiesData.length === dataLength) {\r\n              state.companiesData.sort((a, b) => b.income - a.income);\r\n              showData(state.companiesData, 10);\r\n            }\r\n          });\r\n      });\r\n    });\r\n}\r\n\r\nfunction countAvgIncomes(data) {\r\n  const avgIncomes =\r\n    data.map(income => parseFloat(income.value)).reduce((a, b) => a + b) /\r\n    data.length;\r\n  return avgIncomes.toFixed(2);\r\n}\r\n\r\nfunction countTotalIncomes(data) {\r\n  return data\r\n    .map(income => parseFloat(income.value))\r\n    .reduce((a, b) => a + b)\r\n    .toFixed(2);\r\n}\r\n\r\nfunction showData(data) {\r\n  let sliceFrom = 0 + state.perPage * state.page;\r\n  let sliceTo = state.perPage + state.perPage * state.page;\r\n  pagination.innerHTML = "";\r\n\r\n  table.innerHTML = data\r\n    .map(\r\n      company => `\r\n        <tr class="table__row table__row--js" id="${company.id}">\r\n          <td class="table__data">${company.id}</td>\r\n          <td class="table__data">${company.name}</td>\r\n          <td class="table__data">${company.city}</td>\r\n          <td class="table__data">${company.income}</td>\r\n        </tr>\r\n        `\r\n    )\r\n    .slice(sliceFrom, sliceTo)\r\n    .join("");\r\n\r\n  /* HANDLE COMPANY DETAILS */\r\n\r\n  const detailsContener = document.querySelector(".details--js");\r\n  const detailsIncomes = document.querySelector(".details__incomes");\r\n  const tableContainer = document.querySelector(".container");\r\n  const companyDetails = Array.from(\r\n    document.querySelectorAll(".table__row--js")\r\n  );\r\n\r\n  companyDetails.map(company =>\r\n    company.addEventListener("click", () => {\r\n      detailsContener.classList.add("details--visible");\r\n      tableContainer.classList.add("container--hidden");\r\n      let averageIncomes = null;\r\n      let lastMonthIncome = null;\r\n      let totalRangeIncome = "No incomes in selected range";\r\n      let avgRangeIncome = "No incomes in selected range";\r\n\r\n      fetch("https://recruitment.hal.skygate.io/incomes/" + company.id)\r\n        .then(res => res.json())\r\n        .then(data => {\r\n          const sortedIncomes = data.incomes.sort(\r\n            (a, b) => new Date(b.date) - new Date(a.date)\r\n          );\r\n          const lastMonth = new Date(sortedIncomes[0].date).getMonth();\r\n          const relevantYear = new Date(sortedIncomes[0].date).getFullYear();\r\n          const filteredIncomes = sortedIncomes.filter(\r\n            item =>\r\n              new Date(item.date).getMonth() === lastMonth &&\r\n              new Date(item.date).getFullYear() === relevantYear\r\n          );\r\n\r\n          lastMonthIncome = countTotalIncomes(filteredIncomes);\r\n          averageIncomes = countAvgIncomes(data.incomes);\r\n\r\n          detailsIncomes.innerHTML = `\r\n          <div class="details__box">\r\n          <h1>${company.cells[1].textContent}</h1>\r\n          <p><b>City:</b> ${company.cells[2].textContent}</p>\r\n          <p><b>Total income:</b> ${company.cells[3].textContent}</p>\r\n          <p><b>Average income:</b> ${averageIncomes}</p>\r\n          <p><b>Last month income</b> (${new Date(\r\n            sortedIncomes[0].date\r\n          ).toLocaleDateString("en-GB", {\r\n            month: "long"\r\n          })}): ${lastMonthIncome}</p>\r\n          <p><b>Show total and average incomes</b></p>\r\n        \r\n          <p>\r\n            <label for="incomes-from">From: </label>\r\n            <input type="date" id="incomes-from">\r\n            <label for="incomes-to">To: </label>\r\n            <input type="date" id="incomes-to">\r\n            <div class="tooltip tooltip--js">\r\n              <span class="tooltiptext">Choose subsequent date or the same as a date \'From\'</span>\r\n            </div>\r\n          </p>\r\n\r\n          <div class="details__range details__range--js"></div>\r\n          </div>\r\n          `;\r\n\r\n          const incomesFrom = document.getElementById("incomes-from");\r\n          const incomesTo = document.getElementById("incomes-to");\r\n          const tooltip = document.querySelector(".tooltip--js");\r\n          const detailsRange = document.querySelector(".details__range--js");\r\n          let dateFrom = null;\r\n          let dateTo = null;\r\n\r\n          incomesFrom.addEventListener("change", e => {\r\n            if (e.target.value <= dateTo) {\r\n              tooltip.classList.remove("tooltip--visible");\r\n            } else {\r\n              tooltip.classList.add("tooltip--visible");\r\n              totalRangeIncome = "No incomes in selected range";\r\n              avgRangeIncome = "No incomes in selected range";\r\n              detailsRange.innerHTML = "";\r\n            }\r\n            dateFrom = e.target.value;\r\n            filterIncomesFromRange();\r\n          });\r\n\r\n          incomesTo.addEventListener("change", e => {\r\n            if (e.target.value < dateFrom) {\r\n              tooltip.classList.add("tooltip--visible");\r\n              totalRangeIncome = "No incomes in selected range";\r\n              avgRangeIncome = "No incomes in selected range";\r\n              detailsRange.innerHTML = "";\r\n            } else {\r\n              tooltip.classList.remove("tooltip--visible");\r\n            }\r\n\r\n            dateTo = e.target.value;\r\n            filterIncomesFromRange();\r\n          });\r\n\r\n          function filterIncomesFromRange() {\r\n            if (dateTo >= dateFrom && dateFrom !== null && dateTo !== null) {\r\n              const filteredIncomesFromRange = sortedIncomes.filter(\r\n                item =>\r\n                  new Date(item.date).getTime() >=\r\n                    new Date(dateFrom).getTime() &&\r\n                  new Date(item.date).getTime() <= new Date(dateTo).getTime()\r\n              );\r\n\r\n              if (filteredIncomesFromRange != false) {\r\n                totalRangeIncome = countTotalIncomes(filteredIncomesFromRange);\r\n                avgRangeIncome = countAvgIncomes(filteredIncomesFromRange);\r\n              }\r\n              detailsRange.innerHTML = `\r\n                <p>total: ${totalRangeIncome}</p>\r\n                <p>average: ${avgRangeIncome}</p>\r\n                `;\r\n            }\r\n          }\r\n\r\n          const returnButton = document.getElementById("return");\r\n          returnButton.addEventListener("click", () => {\r\n            detailsContener.classList.remove("details--visible");\r\n            tableContainer.classList.remove("container--hidden");\r\n          });\r\n\r\n          showGraph(sortedIncomes);\r\n        });\r\n    })\r\n  );\r\n\r\n  /* HANDLE PAGINATION */\r\n  for (let i = 1; i <= Math.ceil(data.length / state.perPage); i++) {\r\n    pagination.innerHTML += `\r\n      <button class="pagination__button pagination__button--js">${i}</button>\r\n      `;\r\n  }\r\n\r\n  const buttons = Array.from(\r\n    document.querySelectorAll(".pagination__button--js")\r\n  );\r\n\r\n  buttons.map(button => {\r\n    button.addEventListener("click", e => {\r\n      state.page = e.target.textContent - 1;\r\n      showData(data, state.perPage);\r\n    });\r\n  });\r\n}\r\n\r\n/* HANDLE GRAPH */\r\n\r\nfunction showGraph(incomesArr) {\r\n  const monthlyIncomes = {};\r\n\r\n  incomesArr.map(income => {\r\n    income.id = `${new Date(income.date).toLocaleDateString("en-GB", {\r\n      month: "short"\r\n    })} ${new Date(income.date).getFullYear()}`;\r\n\r\n    if (monthlyIncomes.hasOwnProperty(income.id)) {\r\n      monthlyIncomes[income.id] += +income.value;\r\n    } else {\r\n      monthlyIncomes[income.id] = +income.value;\r\n    }\r\n  });\r\n\r\n  console.log(monthlyIncomes);\r\n\r\n  // Load the Visualization API and the corechart package.\r\n  google.charts.load("current", { packages: ["corechart"] });\r\n\r\n  // Set a callback to run when the Google Visualization API is loaded.\r\n  google.charts.setOnLoadCallback(drawChart);\r\n\r\n  // Callback that creates and populates a data table,\r\n  // instantiates the pie chart, passes in the data and\r\n  // draws it.\r\n  function drawChart() {\r\n    function getPoints() {\r\n      let d = [];\r\n      for (let [key, value] of Object.entries(monthlyIncomes)) {\r\n        d.push([key, value]);\r\n      }\r\n      return d.reverse();\r\n    }\r\n\r\n    // Create the data table.\r\n    var data = new google.visualization.DataTable();\r\n    data.addColumn("string", "");\r\n    data.addColumn("number", "");\r\n    data.addRows(getPoints());\r\n\r\n    // Set chart options\r\n    var options = {\r\n      title: "Monthly incomes",\r\n      height: 300,\r\n      legend: { position: "none" },\r\n      colors: ["#6a5acd"],\r\n      animation: {\r\n        duration: 1000,\r\n        easing: "inAndOut",\r\n        startup: true\r\n      }\r\n    };\r\n\r\n    // Instantiate and draw our chart, passing in some options.\r\n    var chart = new google.visualization.ColumnChart(\r\n      document.getElementById("chart_div")\r\n    );\r\n    chart.draw(data, options);\r\n  }\r\n}\r\n\r\nfetchData();\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvanMvbWFpbi5qcz85MjkxIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvREFBb0QsV0FBVztBQUMvRCxvQ0FBb0MsV0FBVztBQUMvQyxvQ0FBb0MsYUFBYTtBQUNqRCxvQ0FBb0MsYUFBYTtBQUNqRCxvQ0FBb0MsZUFBZTtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQiw2QkFBNkI7QUFDN0MsNEJBQTRCLDZCQUE2QjtBQUN6RCxvQ0FBb0MsNkJBQTZCO0FBQ2pFLHNDQUFzQyxlQUFlO0FBQ3JELHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUUsS0FBSyxnQkFBZ0I7QUFDbEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsaUJBQWlCO0FBQzdDLDhCQUE4QixlQUFlO0FBQzdDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7O0FBRVg7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMOztBQUVBO0FBQ0EsaUJBQWlCLDZDQUE2QztBQUM5RDtBQUNBLGtFQUFrRSxFQUFFO0FBQ3BFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0EsS0FBSyxFQUFFLEdBQUcsb0NBQW9DOztBQUU5QztBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHOztBQUVIOztBQUVBO0FBQ0EsaUNBQWlDLDBCQUEwQjs7QUFFM0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLG1CQUFtQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSIsImZpbGUiOiIwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcblxyXG5jb25zdCB0YWJsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudGFibGVfX2JvZHktLWpzXCIpO1xyXG5jb25zdCBmb3JtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5mb3JtLS1qc1wiKTtcclxuY29uc3Qgc2VhcmNoQ29tcGFueSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlsdGVyXCIpO1xyXG5jb25zdCBzZWxlY3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmZvcm1fX3NlbGVjdC0tanNcIik7XHJcbmNvbnN0IHBhZ2luYXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnBhZ2luYXRpb24tLWpzXCIpO1xyXG5cclxubGV0IHN0YXRlID0ge1xyXG4gIGNvbXBhbmllc0RhdGE6IFtdLFxyXG4gIGZpbHRlcmVkQ29tcGFuaWVzOiBbXSxcclxuICBwYWdlOiAwLFxyXG4gIHBlclBhZ2U6IDEwLFxyXG4gIGxvYWRlZDogZmFsc2VcclxufTtcclxuXHJcbmlmICghc3RhdGUubG9hZGVkKSB7XHJcbiAgdGFibGUuaW5uZXJIVE1MID0gYDx0cj48dGQgY29sc3Bhbj1cIjRcIiBjbGFzcz1cImxvYWRlclwiPjxkaXYgY2xhc3M9XCJsb2FkZXJfX2l0ZW1cIj48L2Rpdj48L3RkPjwvdHI+YDtcclxufVxyXG5cclxuc2VhcmNoQ29tcGFueS5vbmtleXByZXNzID0gaGFuZGxlS2V5cHJlc3M7XHJcbmZvcm0ub25zdWJtaXQgPSBoYW5kbGVTdWJtaXQ7XHJcbnNlbGVjdC5vbmNoYW5nZSA9IGhhbmRsZVNlbGVjdDtcclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUtleXByZXNzKGUpIHtcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGxldCB1c2VySW5wdXQgPSBlLnRhcmdldC52YWx1ZTtcclxuICAgIHN0YXRlLmZpbHRlcmVkQ29tcGFuaWVzID0gc3RhdGUuY29tcGFuaWVzRGF0YS5maWx0ZXIoY29tcGFueSA9PlxyXG4gICAgICBjb21wYW55Lm5hbWUudG9Mb3dlckNhc2UoKS5pbmNsdWRlcyh1c2VySW5wdXQudG9Mb3dlckNhc2UoKSlcclxuICAgICk7XHJcbiAgICBzdGF0ZS5wYWdlID0gMDtcclxuICAgIHNob3dEYXRhKHN0YXRlLmZpbHRlcmVkQ29tcGFuaWVzKTtcclxuICB9LCAxMDAwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlU2VsZWN0KGUpIHtcclxuICBzdGF0ZS5wYWdlID0gMDtcclxuICBzdGF0ZS5wZXJQYWdlID0gcGFyc2VJbnQoZS50YXJnZXQudmFsdWUpO1xyXG4gIHNob3dEYXRhKHN0YXRlLmNvbXBhbmllc0RhdGEpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVTdWJtaXQoZSkge1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZmV0Y2hEYXRhKCkge1xyXG4gIGZldGNoKFwiaHR0cHM6Ly9yZWNydWl0bWVudC5oYWwuc2t5Z2F0ZS5pby9jb21wYW5pZXNcIilcclxuICAgIC50aGVuKHJlcyA9PiByZXMuanNvbigpKVxyXG4gICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgIGNvbnN0IGRhdGFMZW5ndGggPSBkYXRhLmxlbmd0aDtcclxuICAgICAgZGF0YS5tYXAoY29tcGFueSA9PiB7XHJcbiAgICAgICAgZmV0Y2goXCJodHRwczovL3JlY3J1aXRtZW50LmhhbC5za3lnYXRlLmlvL2luY29tZXMvXCIgKyBjb21wYW55LmlkKVxyXG4gICAgICAgICAgLnRoZW4ocmVzID0+IHJlcy5qc29uKCkpXHJcbiAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjb21wYW55SW5jb21lID0gcmVzLmluY29tZXNcclxuICAgICAgICAgICAgICAubWFwKGluY29tZSA9PiBwYXJzZUZsb2F0KGluY29tZS52YWx1ZSkpXHJcbiAgICAgICAgICAgICAgLnJlZHVjZSgoYSwgYikgPT4gYSArIGIpO1xyXG5cclxuICAgICAgICAgICAgc3RhdGUuY29tcGFuaWVzRGF0YS5wdXNoKHtcclxuICAgICAgICAgICAgICBpZDogY29tcGFueS5pZCxcclxuICAgICAgICAgICAgICBuYW1lOiBjb21wYW55Lm5hbWUsXHJcbiAgICAgICAgICAgICAgY2l0eTogY29tcGFueS5jaXR5LFxyXG4gICAgICAgICAgICAgIGluY29tZTogY29tcGFueUluY29tZS50b0ZpeGVkKDIpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoc3RhdGUuY29tcGFuaWVzRGF0YS5sZW5ndGggPT09IGRhdGFMZW5ndGgpIHtcclxuICAgICAgICAgICAgICBzdGF0ZS5jb21wYW5pZXNEYXRhLnNvcnQoKGEsIGIpID0+IGIuaW5jb21lIC0gYS5pbmNvbWUpO1xyXG4gICAgICAgICAgICAgIHNob3dEYXRhKHN0YXRlLmNvbXBhbmllc0RhdGEsIDEwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNvdW50QXZnSW5jb21lcyhkYXRhKSB7XHJcbiAgY29uc3QgYXZnSW5jb21lcyA9XHJcbiAgICBkYXRhLm1hcChpbmNvbWUgPT4gcGFyc2VGbG9hdChpbmNvbWUudmFsdWUpKS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKSAvXHJcbiAgICBkYXRhLmxlbmd0aDtcclxuICByZXR1cm4gYXZnSW5jb21lcy50b0ZpeGVkKDIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb3VudFRvdGFsSW5jb21lcyhkYXRhKSB7XHJcbiAgcmV0dXJuIGRhdGFcclxuICAgIC5tYXAoaW5jb21lID0+IHBhcnNlRmxvYXQoaW5jb21lLnZhbHVlKSlcclxuICAgIC5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiKVxyXG4gICAgLnRvRml4ZWQoMik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dEYXRhKGRhdGEpIHtcclxuICBsZXQgc2xpY2VGcm9tID0gMCArIHN0YXRlLnBlclBhZ2UgKiBzdGF0ZS5wYWdlO1xyXG4gIGxldCBzbGljZVRvID0gc3RhdGUucGVyUGFnZSArIHN0YXRlLnBlclBhZ2UgKiBzdGF0ZS5wYWdlO1xyXG4gIHBhZ2luYXRpb24uaW5uZXJIVE1MID0gXCJcIjtcclxuXHJcbiAgdGFibGUuaW5uZXJIVE1MID0gZGF0YVxyXG4gICAgLm1hcChcclxuICAgICAgY29tcGFueSA9PiBgXHJcbiAgICAgICAgPHRyIGNsYXNzPVwidGFibGVfX3JvdyB0YWJsZV9fcm93LS1qc1wiIGlkPVwiJHtjb21wYW55LmlkfVwiPlxyXG4gICAgICAgICAgPHRkIGNsYXNzPVwidGFibGVfX2RhdGFcIj4ke2NvbXBhbnkuaWR9PC90ZD5cclxuICAgICAgICAgIDx0ZCBjbGFzcz1cInRhYmxlX19kYXRhXCI+JHtjb21wYW55Lm5hbWV9PC90ZD5cclxuICAgICAgICAgIDx0ZCBjbGFzcz1cInRhYmxlX19kYXRhXCI+JHtjb21wYW55LmNpdHl9PC90ZD5cclxuICAgICAgICAgIDx0ZCBjbGFzcz1cInRhYmxlX19kYXRhXCI+JHtjb21wYW55LmluY29tZX08L3RkPlxyXG4gICAgICAgIDwvdHI+XHJcbiAgICAgICAgYFxyXG4gICAgKVxyXG4gICAgLnNsaWNlKHNsaWNlRnJvbSwgc2xpY2VUbylcclxuICAgIC5qb2luKFwiXCIpO1xyXG5cclxuICAvKiBIQU5ETEUgQ09NUEFOWSBERVRBSUxTICovXHJcblxyXG4gIGNvbnN0IGRldGFpbHNDb250ZW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGV0YWlscy0tanNcIik7XHJcbiAgY29uc3QgZGV0YWlsc0luY29tZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmRldGFpbHNfX2luY29tZXNcIik7XHJcbiAgY29uc3QgdGFibGVDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbnRhaW5lclwiKTtcclxuICBjb25zdCBjb21wYW55RGV0YWlscyA9IEFycmF5LmZyb20oXHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRhYmxlX19yb3ctLWpzXCIpXHJcbiAgKTtcclxuXHJcbiAgY29tcGFueURldGFpbHMubWFwKGNvbXBhbnkgPT5cclxuICAgIGNvbXBhbnkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgZGV0YWlsc0NvbnRlbmVyLmNsYXNzTGlzdC5hZGQoXCJkZXRhaWxzLS12aXNpYmxlXCIpO1xyXG4gICAgICB0YWJsZUNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKFwiY29udGFpbmVyLS1oaWRkZW5cIik7XHJcbiAgICAgIGxldCBhdmVyYWdlSW5jb21lcyA9IG51bGw7XHJcbiAgICAgIGxldCBsYXN0TW9udGhJbmNvbWUgPSBudWxsO1xyXG4gICAgICBsZXQgdG90YWxSYW5nZUluY29tZSA9IFwiTm8gaW5jb21lcyBpbiBzZWxlY3RlZCByYW5nZVwiO1xyXG4gICAgICBsZXQgYXZnUmFuZ2VJbmNvbWUgPSBcIk5vIGluY29tZXMgaW4gc2VsZWN0ZWQgcmFuZ2VcIjtcclxuXHJcbiAgICAgIGZldGNoKFwiaHR0cHM6Ly9yZWNydWl0bWVudC5oYWwuc2t5Z2F0ZS5pby9pbmNvbWVzL1wiICsgY29tcGFueS5pZClcclxuICAgICAgICAudGhlbihyZXMgPT4gcmVzLmpzb24oKSlcclxuICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgIGNvbnN0IHNvcnRlZEluY29tZXMgPSBkYXRhLmluY29tZXMuc29ydChcclxuICAgICAgICAgICAgKGEsIGIpID0+IG5ldyBEYXRlKGIuZGF0ZSkgLSBuZXcgRGF0ZShhLmRhdGUpXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgY29uc3QgbGFzdE1vbnRoID0gbmV3IERhdGUoc29ydGVkSW5jb21lc1swXS5kYXRlKS5nZXRNb250aCgpO1xyXG4gICAgICAgICAgY29uc3QgcmVsZXZhbnRZZWFyID0gbmV3IERhdGUoc29ydGVkSW5jb21lc1swXS5kYXRlKS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgICAgY29uc3QgZmlsdGVyZWRJbmNvbWVzID0gc29ydGVkSW5jb21lcy5maWx0ZXIoXHJcbiAgICAgICAgICAgIGl0ZW0gPT5cclxuICAgICAgICAgICAgICBuZXcgRGF0ZShpdGVtLmRhdGUpLmdldE1vbnRoKCkgPT09IGxhc3RNb250aCAmJlxyXG4gICAgICAgICAgICAgIG5ldyBEYXRlKGl0ZW0uZGF0ZSkuZ2V0RnVsbFllYXIoKSA9PT0gcmVsZXZhbnRZZWFyXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIGxhc3RNb250aEluY29tZSA9IGNvdW50VG90YWxJbmNvbWVzKGZpbHRlcmVkSW5jb21lcyk7XHJcbiAgICAgICAgICBhdmVyYWdlSW5jb21lcyA9IGNvdW50QXZnSW5jb21lcyhkYXRhLmluY29tZXMpO1xyXG5cclxuICAgICAgICAgIGRldGFpbHNJbmNvbWVzLmlubmVySFRNTCA9IGBcclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJkZXRhaWxzX19ib3hcIj5cclxuICAgICAgICAgIDxoMT4ke2NvbXBhbnkuY2VsbHNbMV0udGV4dENvbnRlbnR9PC9oMT5cclxuICAgICAgICAgIDxwPjxiPkNpdHk6PC9iPiAke2NvbXBhbnkuY2VsbHNbMl0udGV4dENvbnRlbnR9PC9wPlxyXG4gICAgICAgICAgPHA+PGI+VG90YWwgaW5jb21lOjwvYj4gJHtjb21wYW55LmNlbGxzWzNdLnRleHRDb250ZW50fTwvcD5cclxuICAgICAgICAgIDxwPjxiPkF2ZXJhZ2UgaW5jb21lOjwvYj4gJHthdmVyYWdlSW5jb21lc308L3A+XHJcbiAgICAgICAgICA8cD48Yj5MYXN0IG1vbnRoIGluY29tZTwvYj4gKCR7bmV3IERhdGUoXHJcbiAgICAgICAgICAgIHNvcnRlZEluY29tZXNbMF0uZGF0ZVxyXG4gICAgICAgICAgKS50b0xvY2FsZURhdGVTdHJpbmcoXCJlbi1HQlwiLCB7XHJcbiAgICAgICAgICAgIG1vbnRoOiBcImxvbmdcIlxyXG4gICAgICAgICAgfSl9KTogJHtsYXN0TW9udGhJbmNvbWV9PC9wPlxyXG4gICAgICAgICAgPHA+PGI+U2hvdyB0b3RhbCBhbmQgYXZlcmFnZSBpbmNvbWVzPC9iPjwvcD5cclxuICAgICAgICBcclxuICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiaW5jb21lcy1mcm9tXCI+RnJvbTogPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgaWQ9XCJpbmNvbWVzLWZyb21cIj5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImluY29tZXMtdG9cIj5UbzogPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJkYXRlXCIgaWQ9XCJpbmNvbWVzLXRvXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b29sdGlwIHRvb2x0aXAtLWpzXCI+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0b29sdGlwdGV4dFwiPkNob29zZSBzdWJzZXF1ZW50IGRhdGUgb3IgdGhlIHNhbWUgYXMgYSBkYXRlICdGcm9tJzwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L3A+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImRldGFpbHNfX3JhbmdlIGRldGFpbHNfX3JhbmdlLS1qc1wiPjwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICBgO1xyXG5cclxuICAgICAgICAgIGNvbnN0IGluY29tZXNGcm9tID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmNvbWVzLWZyb21cIik7XHJcbiAgICAgICAgICBjb25zdCBpbmNvbWVzVG8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluY29tZXMtdG9cIik7XHJcbiAgICAgICAgICBjb25zdCB0b29sdGlwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi50b29sdGlwLS1qc1wiKTtcclxuICAgICAgICAgIGNvbnN0IGRldGFpbHNSYW5nZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZGV0YWlsc19fcmFuZ2UtLWpzXCIpO1xyXG4gICAgICAgICAgbGV0IGRhdGVGcm9tID0gbnVsbDtcclxuICAgICAgICAgIGxldCBkYXRlVG8gPSBudWxsO1xyXG5cclxuICAgICAgICAgIGluY29tZXNGcm9tLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSA8PSBkYXRlVG8pIHtcclxuICAgICAgICAgICAgICB0b29sdGlwLmNsYXNzTGlzdC5yZW1vdmUoXCJ0b29sdGlwLS12aXNpYmxlXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LmFkZChcInRvb2x0aXAtLXZpc2libGVcIik7XHJcbiAgICAgICAgICAgICAgdG90YWxSYW5nZUluY29tZSA9IFwiTm8gaW5jb21lcyBpbiBzZWxlY3RlZCByYW5nZVwiO1xyXG4gICAgICAgICAgICAgIGF2Z1JhbmdlSW5jb21lID0gXCJObyBpbmNvbWVzIGluIHNlbGVjdGVkIHJhbmdlXCI7XHJcbiAgICAgICAgICAgICAgZGV0YWlsc1JhbmdlLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGF0ZUZyb20gPSBlLnRhcmdldC52YWx1ZTtcclxuICAgICAgICAgICAgZmlsdGVySW5jb21lc0Zyb21SYW5nZSgpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgaW5jb21lc1RvLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgZSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSA8IGRhdGVGcm9tKSB7XHJcbiAgICAgICAgICAgICAgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKFwidG9vbHRpcC0tdmlzaWJsZVwiKTtcclxuICAgICAgICAgICAgICB0b3RhbFJhbmdlSW5jb21lID0gXCJObyBpbmNvbWVzIGluIHNlbGVjdGVkIHJhbmdlXCI7XHJcbiAgICAgICAgICAgICAgYXZnUmFuZ2VJbmNvbWUgPSBcIk5vIGluY29tZXMgaW4gc2VsZWN0ZWQgcmFuZ2VcIjtcclxuICAgICAgICAgICAgICBkZXRhaWxzUmFuZ2UuaW5uZXJIVE1MID0gXCJcIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0b29sdGlwLmNsYXNzTGlzdC5yZW1vdmUoXCJ0b29sdGlwLS12aXNpYmxlXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkYXRlVG8gPSBlLnRhcmdldC52YWx1ZTtcclxuICAgICAgICAgICAgZmlsdGVySW5jb21lc0Zyb21SYW5nZSgpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgZnVuY3Rpb24gZmlsdGVySW5jb21lc0Zyb21SYW5nZSgpIHtcclxuICAgICAgICAgICAgaWYgKGRhdGVUbyA+PSBkYXRlRnJvbSAmJiBkYXRlRnJvbSAhPT0gbnVsbCAmJiBkYXRlVG8gIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICBjb25zdCBmaWx0ZXJlZEluY29tZXNGcm9tUmFuZ2UgPSBzb3J0ZWRJbmNvbWVzLmZpbHRlcihcclxuICAgICAgICAgICAgICAgIGl0ZW0gPT5cclxuICAgICAgICAgICAgICAgICAgbmV3IERhdGUoaXRlbS5kYXRlKS5nZXRUaW1lKCkgPj1cclxuICAgICAgICAgICAgICAgICAgICBuZXcgRGF0ZShkYXRlRnJvbSkuZ2V0VGltZSgpICYmXHJcbiAgICAgICAgICAgICAgICAgIG5ldyBEYXRlKGl0ZW0uZGF0ZSkuZ2V0VGltZSgpIDw9IG5ldyBEYXRlKGRhdGVUbykuZ2V0VGltZSgpXHJcbiAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKGZpbHRlcmVkSW5jb21lc0Zyb21SYW5nZSAhPSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgdG90YWxSYW5nZUluY29tZSA9IGNvdW50VG90YWxJbmNvbWVzKGZpbHRlcmVkSW5jb21lc0Zyb21SYW5nZSk7XHJcbiAgICAgICAgICAgICAgICBhdmdSYW5nZUluY29tZSA9IGNvdW50QXZnSW5jb21lcyhmaWx0ZXJlZEluY29tZXNGcm9tUmFuZ2UpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICBkZXRhaWxzUmFuZ2UuaW5uZXJIVE1MID0gYFxyXG4gICAgICAgICAgICAgICAgPHA+dG90YWw6ICR7dG90YWxSYW5nZUluY29tZX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD5hdmVyYWdlOiAke2F2Z1JhbmdlSW5jb21lfTwvcD5cclxuICAgICAgICAgICAgICAgIGA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBjb25zdCByZXR1cm5CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJldHVyblwiKTtcclxuICAgICAgICAgIHJldHVybkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBkZXRhaWxzQ29udGVuZXIuY2xhc3NMaXN0LnJlbW92ZShcImRldGFpbHMtLXZpc2libGVcIik7XHJcbiAgICAgICAgICAgIHRhYmxlQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoXCJjb250YWluZXItLWhpZGRlblwiKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHNob3dHcmFwaChzb3J0ZWRJbmNvbWVzKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pXHJcbiAgKTtcclxuXHJcbiAgLyogSEFORExFIFBBR0lOQVRJT04gKi9cclxuICBmb3IgKGxldCBpID0gMTsgaSA8PSBNYXRoLmNlaWwoZGF0YS5sZW5ndGggLyBzdGF0ZS5wZXJQYWdlKTsgaSsrKSB7XHJcbiAgICBwYWdpbmF0aW9uLmlubmVySFRNTCArPSBgXHJcbiAgICAgIDxidXR0b24gY2xhc3M9XCJwYWdpbmF0aW9uX19idXR0b24gcGFnaW5hdGlvbl9fYnV0dG9uLS1qc1wiPiR7aX08L2J1dHRvbj5cclxuICAgICAgYDtcclxuICB9XHJcblxyXG4gIGNvbnN0IGJ1dHRvbnMgPSBBcnJheS5mcm9tKFxyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wYWdpbmF0aW9uX19idXR0b24tLWpzXCIpXHJcbiAgKTtcclxuXHJcbiAgYnV0dG9ucy5tYXAoYnV0dG9uID0+IHtcclxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZSA9PiB7XHJcbiAgICAgIHN0YXRlLnBhZ2UgPSBlLnRhcmdldC50ZXh0Q29udGVudCAtIDE7XHJcbiAgICAgIHNob3dEYXRhKGRhdGEsIHN0YXRlLnBlclBhZ2UpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn1cclxuXHJcbi8qIEhBTkRMRSBHUkFQSCAqL1xyXG5cclxuZnVuY3Rpb24gc2hvd0dyYXBoKGluY29tZXNBcnIpIHtcclxuICBjb25zdCBtb250aGx5SW5jb21lcyA9IHt9O1xyXG5cclxuICBpbmNvbWVzQXJyLm1hcChpbmNvbWUgPT4ge1xyXG4gICAgaW5jb21lLmlkID0gYCR7bmV3IERhdGUoaW5jb21lLmRhdGUpLnRvTG9jYWxlRGF0ZVN0cmluZyhcImVuLUdCXCIsIHtcclxuICAgICAgbW9udGg6IFwic2hvcnRcIlxyXG4gICAgfSl9ICR7bmV3IERhdGUoaW5jb21lLmRhdGUpLmdldEZ1bGxZZWFyKCl9YDtcclxuXHJcbiAgICBpZiAobW9udGhseUluY29tZXMuaGFzT3duUHJvcGVydHkoaW5jb21lLmlkKSkge1xyXG4gICAgICBtb250aGx5SW5jb21lc1tpbmNvbWUuaWRdICs9ICtpbmNvbWUudmFsdWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtb250aGx5SW5jb21lc1tpbmNvbWUuaWRdID0gK2luY29tZS52YWx1ZTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgY29uc29sZS5sb2cobW9udGhseUluY29tZXMpO1xyXG5cclxuICAvLyBMb2FkIHRoZSBWaXN1YWxpemF0aW9uIEFQSSBhbmQgdGhlIGNvcmVjaGFydCBwYWNrYWdlLlxyXG4gIGdvb2dsZS5jaGFydHMubG9hZChcImN1cnJlbnRcIiwgeyBwYWNrYWdlczogW1wiY29yZWNoYXJ0XCJdIH0pO1xyXG5cclxuICAvLyBTZXQgYSBjYWxsYmFjayB0byBydW4gd2hlbiB0aGUgR29vZ2xlIFZpc3VhbGl6YXRpb24gQVBJIGlzIGxvYWRlZC5cclxuICBnb29nbGUuY2hhcnRzLnNldE9uTG9hZENhbGxiYWNrKGRyYXdDaGFydCk7XHJcblxyXG4gIC8vIENhbGxiYWNrIHRoYXQgY3JlYXRlcyBhbmQgcG9wdWxhdGVzIGEgZGF0YSB0YWJsZSxcclxuICAvLyBpbnN0YW50aWF0ZXMgdGhlIHBpZSBjaGFydCwgcGFzc2VzIGluIHRoZSBkYXRhIGFuZFxyXG4gIC8vIGRyYXdzIGl0LlxyXG4gIGZ1bmN0aW9uIGRyYXdDaGFydCgpIHtcclxuICAgIGZ1bmN0aW9uIGdldFBvaW50cygpIHtcclxuICAgICAgbGV0IGQgPSBbXTtcclxuICAgICAgZm9yIChsZXQgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG1vbnRobHlJbmNvbWVzKSkge1xyXG4gICAgICAgIGQucHVzaChba2V5LCB2YWx1ZV0pO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBkLnJldmVyc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDcmVhdGUgdGhlIGRhdGEgdGFibGUuXHJcbiAgICB2YXIgZGF0YSA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5EYXRhVGFibGUoKTtcclxuICAgIGRhdGEuYWRkQ29sdW1uKFwic3RyaW5nXCIsIFwiXCIpO1xyXG4gICAgZGF0YS5hZGRDb2x1bW4oXCJudW1iZXJcIiwgXCJcIik7XHJcbiAgICBkYXRhLmFkZFJvd3MoZ2V0UG9pbnRzKCkpO1xyXG5cclxuICAgIC8vIFNldCBjaGFydCBvcHRpb25zXHJcbiAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgdGl0bGU6IFwiTW9udGhseSBpbmNvbWVzXCIsXHJcbiAgICAgIGhlaWdodDogMzAwLFxyXG4gICAgICBsZWdlbmQ6IHsgcG9zaXRpb246IFwibm9uZVwiIH0sXHJcbiAgICAgIGNvbG9yczogW1wiIzZhNWFjZFwiXSxcclxuICAgICAgYW5pbWF0aW9uOiB7XHJcbiAgICAgICAgZHVyYXRpb246IDEwMDAsXHJcbiAgICAgICAgZWFzaW5nOiBcImluQW5kT3V0XCIsXHJcbiAgICAgICAgc3RhcnR1cDogdHJ1ZVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEluc3RhbnRpYXRlIGFuZCBkcmF3IG91ciBjaGFydCwgcGFzc2luZyBpbiBzb21lIG9wdGlvbnMuXHJcbiAgICB2YXIgY2hhcnQgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ29sdW1uQ2hhcnQoXHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2hhcnRfZGl2XCIpXHJcbiAgICApO1xyXG4gICAgY2hhcnQuZHJhdyhkYXRhLCBvcHRpb25zKTtcclxuICB9XHJcbn1cclxuXHJcbmZldGNoRGF0YSgpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///0\n')}]);