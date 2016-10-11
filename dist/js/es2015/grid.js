export class Grid {
    constructor() {
        this.columnDefinitions = [{ actions: [], classList: '', displayName: 'foo', id: 1, isVisible: true, propertyName: 'foo' }];
        this.rows = [{ foo: 'bar', id: 1 }];
        this.gridOptions = { editingEnabled: true, id: null, parentElement: null, sortingEnabled: true, theadClassList: '' };
        this.gridState = {
            columnDefinitionSortedOn: this.columnDefinitions[0],
            currentSortDirection: SortDirection.None,
            focusedColumnDefinition: this.columnDefinitions[0],
            focusedRow: this.rows[0],
            id: null,
            mousedOverColumnDefinition: this.columnDefinitions[0],
            mousedOverRow: this.rows[0],
        };
    }
    buildGrid(parentElement) {
        this.gridState.id = this.gridState.id || (this.gridOptions.id || Math.floor(Math.random() * 10000).toString());
        this.parentElement = this.parentElement || (parentElement || document.body);
        let gridElement = document.getElementById(`grid-table-${this.gridState.id}`);
        if (gridElement) {
            this.parentElement.removeChild(gridElement);
        }
        let tableElement = document.createElement('table');
        tableElement.id = `grid-table-${this.gridState.id}`;
        let theadElement = this.buildThead();
        tableElement.appendChild(theadElement);
        let tbodyElement = this.buildTbody();
        tableElement.appendChild(tbodyElement);
        this.parentElement.appendChild(tableElement);
    }
    buildTbody() {
        let tbodyElement = document.createElement('tbody');
        this.rows
            .map(row => {
            let trElement = document.createElement('tr');
            if (this.gridState.focusedRow === row) {
                trElement.classList.add('focus');
            }
            if (this.gridState.mousedOverRow === row) {
                trElement.classList.add('mouseover');
            }
            if (row.classList) {
                trElement.classList.add(row.classList);
            }
            this.columnDefinitions
                .filter(columnDefinition => columnDefinition.isVisible)
                .map(columnDefinition => {
                let tdElement = document.createElement('td');
                if (this.gridState.focusedRow === row) {
                    tdElement.classList.add('focus');
                }
                if (this.gridState.mousedOverRow === row) {
                    tdElement.classList.add('mouseover');
                }
                if (this.gridOptions.editingEnabled && this.gridState.focusedRow === row && this.gridState.focusedColumnDefinition === columnDefinition) {
                    let inputElement = document.createElement('input');
                    inputElement.value = row[columnDefinition.propertyName];
                    inputElement.addEventListener('blur', this.cellBlurred.bind(this, columnDefinition, row));
                    tdElement.appendChild(inputElement);
                }
                else {
                    tdElement.innerHTML = row[columnDefinition.propertyName];
                    tdElement.addEventListener('click', this.cellClicked.bind(this, columnDefinition, row));
                }
                tdElement.addEventListener('mouseover', this.cellMousedOver.bind(this, columnDefinition, row));
                tdElement.addEventListener('mouseout', this.cellMousedOut.bind(this, columnDefinition, row));
                return tdElement;
            })
                .forEach(tdElement => trElement.appendChild(tdElement));
            return trElement;
        })
            .forEach(trElement => tbodyElement.appendChild(trElement));
        return tbodyElement;
    }
    updateCellClasses() {
        let tableRowElements = document.getElementById(`grid-table-${this.gridState.id}`)
            .getElementsByTagName('tbody')[0]
            .getElementsByTagName('tr');
        for (let rowId = 0; rowId < tableRowElements.length; rowId++) {
            let tableCellElements = tableRowElements[rowId].getElementsByTagName('td');
            for (let columnId = 0; columnId < tableCellElements.length; columnId++) {
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
    }
    cellBlurred(columnDefinition, row) {
        this.gridState.focusedColumnDefinition = null;
        this.gridState.focusedRow = null;
        this.updateCellClasses();
    }
    cellClicked(columnDefinition, row) {
        this.gridState.focusedColumnDefinition = columnDefinition;
        this.gridState.focusedRow = row;
        this.updateCellClasses();
    }
    cellMousedOver(columnDefinition, row) {
        this.gridState.mousedOverColumnDefinition = columnDefinition;
        this.gridState.mousedOverRow = row;
    }
    cellMousedOut(columnDefinition, row) {
        this.gridState.mousedOverColumnDefinition = null;
        this.gridState.mousedOverRow = null;
    }
    headerCellMousedOut(columnDefinition) {
        this.gridState.mousedOverColumnDefinition = null;
        this.updateCellClasses();
    }
    headerCellClicked(columnDefinition) {
        this.gridState.focusedColumnDefinition = columnDefinition;
        this.updateCellClasses();
    }
    headerCellMousedOver(columnDefinition) {
        this.gridState.mousedOverColumnDefinition = columnDefinition;
        this.updateCellClasses();
    }
    buildThead() {
        let theadElement = document.createElement('thead');
        let trElement = document.createElement('tr');
        if (this.gridOptions.theadClassList) {
            trElement.classList.add(this.gridOptions.theadClassList);
        }
        this.columnDefinitions
            .filter(columnDefinition => columnDefinition.isVisible)
            .map(columnDefinition => {
            let thElement = document.createElement('th');
            if (this.gridState.focusedColumnDefinition === columnDefinition) {
                thElement.classList.add('focus');
            }
            if (this.gridState.mousedOverColumnDefinition === columnDefinition) {
                thElement.classList.add('mouseover');
            }
            if (columnDefinition.classList) {
                theadElement.classList.add(columnDefinition.classList);
            }
            thElement.innerHTML = columnDefinition.displayName;
            if (this.gridOptions.sortingEnabled && this.gridState.columnDefinitionSortedOn === columnDefinition) {
                let sortIcon = document.createElement('i');
                switch (this.gridState.currentSortDirection) {
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
            thElement.addEventListener('click', this.headerCellClicked.bind(this, columnDefinition));
            thElement.addEventListener('mouseover', this.headerCellMousedOver.bind(this, columnDefinition));
            thElement.addEventListener('mouseout', this.headerCellMousedOut.bind(this, columnDefinition));
            return thElement;
        })
            .forEach(thElement => trElement.appendChild(thElement));
        theadElement.appendChild(trElement);
        return theadElement;
    }
}
class ColumnDefinition {
}
class GridOptions {
}
class GridState {
}
var SortDirection;
(function (SortDirection) {
    SortDirection[SortDirection["None"] = 0] = "None";
    SortDirection[SortDirection["Ascending"] = 1] = "Ascending";
    SortDirection[SortDirection["Descending"] = 2] = "Descending";
})(SortDirection || (SortDirection = {}));

//# sourceMappingURL=maps/grid.js.map
