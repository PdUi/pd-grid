class Grid {
    private columnDefinitions: ColumnDefinition[] = [ { actions: [], classList: '', displayName: 'foo', id: 1, isEditable: true, isVisible: true, propertyName: 'foo' } ];
    private rows: any[] = [ { foo: 'bar', id: 1 } ];
    private gridOptions: GridOptions = { editingEnabled: true, id: null, parentElement: null, sortingEnabled: true, theadClassList: '' };
    private gridState: GridState = {
        columnDefinitionSortedOn: this.columnDefinitions[0],
        currentSortDirection: SortDirection.None,
        focusedColumnDefinition: null,
        focusedRow: null,
        id: null,
        mousedOverColumnDefinition: null,
        mousedOverRow: null,
    };
    private parentElement: HTMLElement;

    public buildGrid(parentElement?: HTMLElement): void {
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

    private buildTbody(): HTMLElement {
        let tbodyElement = document.createElement('tbody');
        this.rows
            .map(row => {
                let trElement = document.createElement('tr');
                // TODO: have row provide function for adding class to tr(i.e. function(obj) { return obj.isActive ? '' : 'inactive'; })
                if (this.gridState.focusedRow === row) {
                    this.addClassesToHtmlElement(trElement, 'focus');
                }

                if (this.gridState.mousedOverRow === row) {
                    this.addClassesToHtmlElement(trElement, 'mouseover');
                }

                this.addClassesToHtmlElement(trElement, row.classList);

                this.columnDefinitions
                    .filter(columnDefinition => columnDefinition.isVisible)
                    .map(columnDefinition => {
                        // TODO: have columnDefinition provide function for adding class to cell(i.e. function(money) { return money < 0 ? 'negative' : ''; })
                        let tdElement = document.createElement('td');
                        if (this.gridState.focusedRow === row) {
                            this.addClassesToHtmlElement(tdElement, 'focus');
                        }

                        if (this.gridState.mousedOverRow === row) {
                            this.addClassesToHtmlElement(tdElement, 'mouseover');
                        }

                        if (this.gridOptions.editingEnabled && this.gridState.focusedRow === row && this.gridState.focusedColumnDefinition === columnDefinition) {
                            let inputElement = document.createElement('input');
                            inputElement.value = row[columnDefinition.propertyName];

                            inputElement.addEventListener('blur', this.cellBlurred.bind(this, columnDefinition, row));
                            tdElement.appendChild(inputElement);
                        } else {
                            // TODO: provide formatter function on columnDefinition
                            tdElement.innerHTML = row[columnDefinition.propertyName];
                            tdElement.addEventListener('click', this.cellClicked.bind(this, columnDefinition, row));
                            tdElement.addEventListener('dblclick', this.cellDoubleClicked.bind(this, columnDefinition, row));
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

    private updateCellClasses(): void {
        let tableRowElements = document.getElementById(`grid-table-${this.gridState.id}`)
                                       .getElementsByTagName('tbody')[0]
                                       .getElementsByTagName('tr');

        for (let rowId = 0; rowId < tableRowElements.length; rowId++) {
            let row = tableRowElements[rowId];

            if (this.gridState.focusedRow === row && !row.classList.contains('focus')) {
                row.classList.add('focus');
            }

            if (this.gridState.mousedOverRow === row && !row.classList.contains('mouseover')) {
                row.classList.add('mouseover');
            }

            let tableCellElements = row.getElementsByTagName('td');

            for (let columnId = 0; columnId < tableCellElements.length; columnId++) {
                if (this.rows[rowId] === this.gridState.focusedRow && this.columnDefinitions[columnId] === this.gridState.focusedColumnDefinition) {
                    if (!tableCellElements[columnId].classList.contains('focus')) {
                        tableCellElements[columnId].classList.add('focus');
                    }
                } else {
                    if (tableCellElements[columnId].classList.contains('focus')) {
                        tableCellElements[columnId].classList.remove('focus');
                    }
                }

                if (this.rows[rowId] === this.gridState.mousedOverRow && this.columnDefinitions[columnId] === this.gridState.mousedOverColumnDefinition) {
                    if (!tableCellElements[columnId].classList.contains('mouseover')) {
                        tableCellElements[columnId].classList.add('mouseover');
                    }
                } else {
                    if (tableCellElements[columnId].classList.contains('mouseover')) {
                        tableCellElements[columnId].classList.remove('mouseover');
                    }
                }
            }
        }
    }

    private addClassesToHtmlElement(element: HTMLElement, classList: string | string[]) {
        if (classList.length <= 0) return;

        if (typeof(classList) === 'string') {
            if (!element.classList.contains(classList)) {
                element.classList.add(classList);
            }
        } else {
            classList.forEach(cssClass => {
                if (!element.classList.contains(cssClass)) {
                    element.classList.add(cssClass);
                }
            })
        }
    }

    private cellBlurred(columnDefinition, row): void {
        this.gridState.focusedColumnDefinition = null;
        this.gridState.focusedRow = null;
        this.updateCellClasses();
    }

    private cellClicked(columnDefinition, row): void {
        this.gridState.focusedColumnDefinition = columnDefinition;
        this.gridState.focusedRow = row;
        this.updateCellClasses();
    }

    private cellDoubleClicked(columnDefinition, row): void {
        this.gridState.focusedColumnDefinition = columnDefinition;
        this.gridState.focusedRow = row;
        this.updateCellClasses();
    }

    private cellMousedOver(columnDefinition, row): void {
        this.gridState.mousedOverColumnDefinition = columnDefinition;
        this.gridState.mousedOverRow = row;
        this.updateCellClasses();
    }

    private cellMousedOut(columnDefinition, row): void {
        this.gridState.mousedOverColumnDefinition = null;
        this.gridState.mousedOverRow = null;
        this.updateCellClasses();
    }

    private headerCellMousedOut(columnDefinition): void {
        this.gridState.mousedOverColumnDefinition = null;
        this.updateCellClasses();
    }

    private headerCellClicked(columnDefinition): void {
        this.gridState.focusedColumnDefinition = columnDefinition;
        this.updateCellClasses();
    }

    private headerCellMousedOver(columnDefinition): void {
        this.gridState.mousedOverColumnDefinition = columnDefinition;
        this.updateCellClasses();
    }

    private buildThead(): HTMLElement {
        let theadElement = document.createElement('thead');
        let trElement = document.createElement('tr');
        if (this.gridOptions.theadClassList) {
            if (typeof(this.gridOptions.theadClassList) === 'string') {
                trElement.classList.add(this.gridOptions.theadClassList);
            } else {
                this.gridOptions.theadClassList.forEach(cssClass => trElement.classList.add(cssClass));
            }
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
                    if (typeof(columnDefinition.classList) === 'string') {
                        theadElement.classList.add(columnDefinition.classList);
                    } else {
                        columnDefinition.classList.forEach(cssClass => theadElement.classList.add(cssClass));
                    }
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
    public actions: { actionName: string }[]; // header.click, header.mouseover
    public classList: string | string[];
    public displayName: string;
    public id: number;
    public isEditable: boolean;
    public isVisible: boolean;
    public propertyName: string;
}

class GridOptions {
    public editingEnabled: boolean;
    public id: string;
    public parentElement: HTMLElement;
    public sortingEnabled: boolean;
    public theadClassList: string | string[];
}

class GridState {
    public columnDefinitionSortedOn: ColumnDefinition;
    public currentSortDirection: SortDirection;
    public focusedColumnDefinition: ColumnDefinition;
    public focusedRow: any;
    public id: string;
    public mousedOverColumnDefinition: ColumnDefinition;
    public mousedOverRow: any;
}

enum SortDirection {
    None = 0,
    Ascending = 1,
    Descending = 2
}
