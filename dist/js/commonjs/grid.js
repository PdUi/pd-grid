"use strict";
var Grid = (function () {
    function Grid() {
        this.columnDefinitions = [{ actions: [], classList: '', displayName: 'foo', id: 1, isEditable: true, isVisible: true, propertyName: 'foo' }];
        this.rows = [{ foo: 'bar', id: 1 }];
        this.gridOptions = { editingEnabled: true, id: null, parentElement: null, sortingEnabled: true, theadClassList: '' };
        this.gridState = {
            columnDefinitionSortedOn: this.columnDefinitions[0],
            currentSortDirection: SortDirection.None,
            focusedColumnDefinition: null,
            focusedRow: null,
            id: null,
            mousedOverColumnDefinition: null,
            mousedOverRow: null,
        };
    }
    Grid.prototype.buildGrid = function (parentElement) {
        this.gridState.id = this.gridState.id || (this.gridOptions.id || Math.floor(Math.random() * 10000).toString());
        this.parentElement = this.parentElement || (parentElement || document.body);
        var gridElement = document.getElementById("grid-table-" + this.gridState.id);
        if (gridElement) {
            this.parentElement.removeChild(gridElement);
        }
        var tableElement = document.createElement('table');
        tableElement.id = "grid-table-" + this.gridState.id;
        var theadElement = this.buildThead();
        tableElement.appendChild(theadElement);
        var tbodyElement = this.buildTbody();
        tableElement.appendChild(tbodyElement);
        this.parentElement.appendChild(tableElement);
    };
    Grid.prototype.buildTbody = function () {
        var _this = this;
        var tbodyElement = document.createElement('tbody');
        this.rows
            .map(function (row) {
            var trElement = document.createElement('tr');
            if (_this.gridState.focusedRow === row) {
                trElement.classList.add('focus');
            }
            if (_this.gridState.mousedOverRow === row) {
                trElement.classList.add('mouseover');
            }
            if (row.classList) {
                trElement.classList.add(row.classList);
            }
            _this.columnDefinitions
                .filter(function (columnDefinition) { return columnDefinition.isVisible; })
                .map(function (columnDefinition) {
                var tdElement = document.createElement('td');
                if (_this.gridState.focusedRow === row) {
                    tdElement.classList.add('focus');
                }
                if (_this.gridState.mousedOverRow === row) {
                    tdElement.classList.add('mouseover');
                }
                if (_this.gridOptions.editingEnabled && _this.gridState.focusedRow === row && _this.gridState.focusedColumnDefinition === columnDefinition) {
                    var inputElement = document.createElement('input');
                    inputElement.value = row[columnDefinition.propertyName];
                    inputElement.addEventListener('blur', _this.cellBlurred.bind(_this, columnDefinition, row));
                    tdElement.appendChild(inputElement);
                }
                else {
                    tdElement.innerHTML = row[columnDefinition.propertyName];
                    tdElement.addEventListener('click', _this.cellClicked.bind(_this, columnDefinition, row));
                    tdElement.addEventListener('dblclick', _this.cellDoubleClicked.bind(_this, columnDefinition, row));
                }
                tdElement.addEventListener('mouseover', _this.cellMousedOver.bind(_this, columnDefinition, row));
                tdElement.addEventListener('mouseout', _this.cellMousedOut.bind(_this, columnDefinition, row));
                return tdElement;
            })
                .forEach(function (tdElement) { return trElement.appendChild(tdElement); });
            return trElement;
        })
            .forEach(function (trElement) { return tbodyElement.appendChild(trElement); });
        return tbodyElement;
    };
    Grid.prototype.updateCellClasses = function () {
        var tableRowElements = document.getElementById("grid-table-" + this.gridState.id)
            .getElementsByTagName('tbody')[0]
            .getElementsByTagName('tr');
        for (var rowId = 0; rowId < tableRowElements.length; rowId++) {
            var tableCellElements = tableRowElements[rowId].getElementsByTagName('td');
            for (var columnId = 0; columnId < tableCellElements.length; columnId++) {
                if (this.rows[rowId] === this.gridState.focusedRow && this.columnDefinitions[columnId] === this.gridState.focusedColumnDefinition) {
                    if (!tableCellElements[columnId].classList.contains('focus')) {
                        tableCellElements[columnId].classList.add('focus');
                    }
                }
                else {
                    if (tableCellElements[columnId].classList.contains('focus')) {
                        tableCellElements[columnId].classList.remove('focus');
                    }
                }
                if (this.rows[rowId] === this.gridState.mousedOverRow && this.columnDefinitions[columnId] === this.gridState.mousedOverColumnDefinition) {
                    if (!tableCellElements[columnId].classList.contains('mouseover')) {
                        tableCellElements[columnId].classList.add('mouseover');
                    }
                }
                else {
                    if (tableCellElements[columnId].classList.contains('mouseover')) {
                        tableCellElements[columnId].classList.remove('mouseover');
                    }
                }
            }
        }
    };
    Grid.prototype.cellBlurred = function (columnDefinition, row) {
        this.gridState.focusedColumnDefinition = null;
        this.gridState.focusedRow = null;
        this.updateCellClasses();
    };
    Grid.prototype.cellClicked = function (columnDefinition, row) {
        this.gridState.focusedColumnDefinition = columnDefinition;
        this.gridState.focusedRow = row;
        this.updateCellClasses();
    };
    Grid.prototype.cellDoubleClicked = function (columnDefinition, row) {
        this.gridState.focusedColumnDefinition = columnDefinition;
        this.gridState.focusedRow = row;
        this.updateCellClasses();
    };
    Grid.prototype.cellMousedOver = function (columnDefinition, row) {
        this.gridState.mousedOverColumnDefinition = columnDefinition;
        this.gridState.mousedOverRow = row;
        this.updateCellClasses();
    };
    Grid.prototype.cellMousedOut = function (columnDefinition, row) {
        this.gridState.mousedOverColumnDefinition = null;
        this.gridState.mousedOverRow = null;
        this.updateCellClasses();
    };
    Grid.prototype.headerCellMousedOut = function (columnDefinition) {
        this.gridState.mousedOverColumnDefinition = null;
        this.updateCellClasses();
    };
    Grid.prototype.headerCellClicked = function (columnDefinition) {
        this.gridState.focusedColumnDefinition = columnDefinition;
        this.updateCellClasses();
    };
    Grid.prototype.headerCellMousedOver = function (columnDefinition) {
        this.gridState.mousedOverColumnDefinition = columnDefinition;
        this.updateCellClasses();
    };
    Grid.prototype.buildThead = function () {
        var _this = this;
        var theadElement = document.createElement('thead');
        var trElement = document.createElement('tr');
        if (this.gridOptions.theadClassList) {
            trElement.classList.add(this.gridOptions.theadClassList);
        }
        this.columnDefinitions
            .filter(function (columnDefinition) { return columnDefinition.isVisible; })
            .map(function (columnDefinition) {
            var thElement = document.createElement('th');
            if (_this.gridState.focusedColumnDefinition === columnDefinition) {
                thElement.classList.add('focus');
            }
            if (_this.gridState.mousedOverColumnDefinition === columnDefinition) {
                thElement.classList.add('mouseover');
            }
            if (columnDefinition.classList) {
                theadElement.classList.add(columnDefinition.classList);
            }
            thElement.innerHTML = columnDefinition.displayName;
            if (_this.gridOptions.sortingEnabled && _this.gridState.columnDefinitionSortedOn === columnDefinition) {
                var sortIcon = document.createElement('i');
                switch (_this.gridState.currentSortDirection) {
                    case SortDirection.Ascending:
                        sortIcon.innerHTML = '&#9650;';
                        thElement.appendChild(sortIcon);
                        break;
                    case SortDirection.Descending:
                        sortIcon.innerHTML = '&#9660;';
                        thElement.insertBefore(sortIcon, thElement.firstChild);
                        break;
                    default:
                        break;
                }
            }
            thElement.addEventListener('click', _this.headerCellClicked.bind(_this, columnDefinition));
            thElement.addEventListener('mouseover', _this.headerCellMousedOver.bind(_this, columnDefinition));
            thElement.addEventListener('mouseout', _this.headerCellMousedOut.bind(_this, columnDefinition));
            return thElement;
        })
            .forEach(function (thElement) { return trElement.appendChild(thElement); });
        theadElement.appendChild(trElement);
        return theadElement;
    };
    return Grid;
}());
exports.Grid = Grid;
var ColumnDefinition = (function () {
    function ColumnDefinition() {
    }
    return ColumnDefinition;
}());
var GridOptions = (function () {
    function GridOptions() {
    }
    return GridOptions;
}());
var GridState = (function () {
    function GridState() {
    }
    return GridState;
}());
var SortDirection;
(function (SortDirection) {
    SortDirection[SortDirection["None"] = 0] = "None";
    SortDirection[SortDirection["Ascending"] = 1] = "Ascending";
    SortDirection[SortDirection["Descending"] = 2] = "Descending";
})(SortDirection || (SortDirection = {}));

//# sourceMappingURL=maps/grid.js.map
