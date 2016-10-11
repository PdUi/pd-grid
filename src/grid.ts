class Grid {
    private columnDefinitions: ColumnDefinition[] = [ { actions: [], classList: '', displayName: 'foo', id: 1, isVisible: true, propertyName: 'foo' } ];
    private rows: any[] = [ { foo: 'bar', id: 1 } ];
    private gridOptions: GridOptions = { editingEnabled: true, id: null, parentElement: null, sortingEnabled: true, theadClassList: '' };
    private gridState: GridState = {
        columnDefinitionSortedOn: this.columnDefinitions[0],
        currentSortDirection: SortDirection.None,
        focusedColumnDefinition: this.columnDefinitions[0],
        focusedRow: this.rows[0],
        id: null,
        mousedOverColumnDefinition: this.columnDefinitions[0],
        mousedOverRow: this.rows[0],
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
                        // TODO: have columnDefinition provide function for adding class to cell(i.e. function(money) { return money < 0 ? 'negative' : ''; })
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
                        } else {
                            // TODO: provide formatter function on columnDefinition
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

    private updateCellClasses(): void {
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
                            // this.gridState.currentSortDirection = SortDirection.Descending;
                            sortIcon.innerHTML = '&#9650;';
                            thElement.appendChild(sortIcon);
                            break;
                        case SortDirection.Descending:
                            sortIcon.innerHTML = '&#9660;';
                            thElement.insertBefore(sortIcon, thElement.firstChild);
                            // this.gridState.currentSortDirection = SortDirection.None;
                            break;
                        default:
                            // this.gridState.currentSortDirection = SortDirection.Ascending;
                            // sortIcon.innerHTML = '&#9660;';
                            // thElement.insertBefore(sortIcon, thElement.firstChild);
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
    public classList: string;
    public displayName: string;
    public id: number;
    public isVisible: boolean;
    public propertyName: string;
}

class GridOptions {
    public editingEnabled: boolean;
    public id: string;
    public parentElement: HTMLElement;
    public sortingEnabled: boolean;
    public theadClassList: string;
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
// <table class="table-striped grid">
//     <thead>
//         <tr>
//             <th data-ng-class="{selected: columnDefintion.id === gridVm.selectedColumnDefinitionId}"
//                 data-ng-repeat="columnDefinition in gridVm.columnDefinitions track by $index"
//                 data-ng-click="gridVm.sort(columnDefinition)">
//                 <div>
//                     <div data-ng-visible="gridVm.sortedColumn === columnDefinition.id && gridVm.sortDirection === 'ascending'">
//                         <i class="glyphicon glyphicon-chevron-up"></i>
//                     </div>
//                     {{columnDefinition.title}}
//                     <div data-ng-visible="gridVm.sortedColumn === columnDefinition.id && gridVm.sortDirection === 'descending'">
//                         <i class="glyphicon glyphicon-chevron-down"></i>
//                     </div>
//                 </div>
//             </th>
//             <th data-ng-if="gridVm.gridActions.length" id="grid-actions-column"></th>
//         </tr>
//     </thead>
//     <tbody>
//         <tr data-ng-class="{selected: row.id == gridVm.selectedRowId}"
//             data-ng-repeat="row in gridVm.rows"
//             ng-init="rowId = $index">
//             <td data-ng-repeat="columnDefinition in gridVm.columnDefinitions track by $index"
//                 data-ng-click="gridVm.onclick($event, columnDefinition, row)"
//                 data-ng-mouseenter="gridVm.hoveredColumnDefinition = columnDefinition;"
//                 data-ng-mouseleave="gridVm.hoveredColumnDefinition = {};">
//                 <input data-ng-if="gridVm.settings.enableInlineEditing"
//                        data-ng-show="gridVm.selectedColumnDefinitionId == columnDefinition.id && row.id == gridVm.selectedRowId"
//                        data-ng-model="row[columnDefinition.id]"
//                        data-ng-blur="gridVm.onblur()"
//                        type="text" />
//                 <span data-ng-hide="gridVm.selectedColumnDefinitionId == columnDefinition.id && row.id == gridVm.selectedRowId">
//                     {{row[columnDefinition.id]}}
//                 </span>
//             </td>

//             <td data-ng-if="gridVm.gridActions.length">
//                 <span data-ng-repeat="action in gridVm.gridActions track by $index"
//                       data-ng-click="action.action(row)">
//                     {{action.name}}
//                 </span>
//             </td>
//         </tr>
//     </tbody>
// </table>

// (function () {
//     'use strict';

//     angular.module('app')
//            .directive('pdGrid', pdGridDirective)
//            .controller('PdGridCtrl', ['$scope', '$timeout', pdGridController]);

//     function pdGridDirective() {
//         return {
//             scope: {
//                 'actions': '=',
//                 'data': '=',
//                 'settings': '='
//             },
//             templateUrl: 'templates/components/pd.grid.html',
//             controller: 'PdGridCtrl',
//             controllerAs: 'gridVm',
//             restrict: 'E'
//         };
//     }

//     function pdGridController($scope, $timeout) {
//         var vm = this;

//         vm.actions = $scope.actions || [];
//         vm.data = $scope.data || {};
//         vm.settings = $scope.settings || {};

//         vm.gridActions = _.filter(vm.actions, function (action) { return action.name.toLowerCase() !== 'sort'; });

//         vm.columnDefinitions = vm.data.columnDefinitions || [];
//         vm.rows = vm.data.rows || [];

//         vm.selectedColumnDefinitionId = '';
//         vm.selectedRowId = 0;
//         vm.onclick = function (event, columnDefinition, row) {
//             if (vm.settings.enableInlineEditing) {
//                 vm.selectedColumnDefinitionId = columnDefinition.id;
//                 vm.selectedRowId = row.id;

//                 var inputElement = angular.element(event.currentTarget).children()[0];
//                  $timeout(function () {
//                     inputElement.select();

//                 }, 1);
//             }
//         };

//         vm.onblur = function() {
//             vm.selectedColumnDefinitionId = '';
//             vm.selectedRowId = 0;
//         };

//         vm.sortedColumn = '';
//         vm.sortDirection = 'none';

//         vm.sort = function(columnDefinition) {
//             var sortAction = _.find(vm.actions, function (action) { return action.name.toLowerCase() === 'sort'; });

//             if (sortAction) {
//                 if (vm.sortedColumn !== columnDefinition.id) {
//                     vm.sortDirection = 'none';
//                 }

//                 if (vm.sortDirection === 'none') {
//                     vm.sortedColumn = columnDefinition.id;
//                     vm.sortDirection = 'ascending';
//                 } else if (vm.sortDirection === 'ascending') {
//                     vm.sortedColumn = columnDefinition.id;
//                     vm.sortDirection = 'descending';
//                 } else {
//                     vm.sortedColumn = '';
//                     vm.sortDirection = 'none';
//                 }

//                 var sortResults = sortAction.action(columnDefinition, vm.sortDirection);
//                 vm.rows = sortResults;
//             }
//         };

//         $scope.$watch(
//             'data',
//             function () {
//                 vm.rows = vm.data.rows;
//             },
//             true
//         );

//         $scope.$watch(
//             'actions',
//             function () {
//                 vm.gridActions = _.filter($scope.actions, function (action) { return action.name.toLowerCase() !== 'sort'; });
//             },
//             true
//         );
//     }
// })();
