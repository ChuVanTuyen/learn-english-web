import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PaginationService {
    maxSize: number = 7;

    constructor() { }

    getDataPaginate(index: number, arr: any, limit: number) {
        if (arr == null) {
            return [];
        }

        let size;
        let result;
        let from;
        let to;
        let showPreviousLast;
        let showNextLast;
        size   = arr.length;
        result = [];
        from   = index * limit;
        to     = from  + limit;
        showPreviousLast = false;
        showNextLast = false;

        // Check show or hide button nextLast or previousLast
        if (index === 0) {
            showPreviousLast = false;
        } else {
            showPreviousLast = true;
        }

        if ((index + 1) * limit >= size) {
            showNextLast = false;
        } else {
            showNextLast = true;
        }

        // Get data pagination
        if (to > size) {
            to = size;
        }
        for (let i = from; i < to; i++) {
            result.push(arr[i]);
        }
        
        return {
            result,
            showNextLast,
            showPreviousLast
        };
    }

    createPageArray(currentPage: number, paginationRange: number, total: number, limit: number) {
        paginationRange = +paginationRange;

        let pages = [];
        let totalPages;
        let halfWay;
        let isStart;
        let isEnd;
        let isMiddle;
        let ellipsesNeeded;
        let i;

        totalPages = Math.ceil(total / limit);
        halfWay = Math.ceil(paginationRange / 2);
        isStart = currentPage <= halfWay;
        isEnd = totalPages - halfWay < currentPage;
        isMiddle = !isStart && !isEnd;
        ellipsesNeeded = paginationRange < totalPages;
        i = 1;

        while (i <= totalPages && i <= paginationRange) {
            let label;
            let pageNumber;
            let openingEllipsesNeeded;
            let closingEllipsesNeeded;
            label = void 0;
            pageNumber = this.calculatePageNumber(i, currentPage, paginationRange, totalPages);
            openingEllipsesNeeded = (i === 2 && (isMiddle || isEnd));
            closingEllipsesNeeded = (i === paginationRange - 1 && (isMiddle || isStart));

            if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
                label = '...';
            } else {
                label = pageNumber;
            }
            pages.push({
                label,
                value: pageNumber
            });
            i++;
        }
        return pages;
    }

    calculatePageNumber(i: number, currentPage: number, paginationRange: number, totalPages: number) {
        let halfWay;
        halfWay = Math.ceil(paginationRange / 2);

        if (i === paginationRange) {
            return totalPages;
        } else if (i === 1) {
            return i;
        } else if (paginationRange < totalPages) {
            if (totalPages - halfWay < currentPage) {
                return totalPages - paginationRange + i;
            } else if (halfWay < currentPage) {
                return currentPage - halfWay + i;
            } else {
                return i;
            }
        } else {
            return i;
        }
    }
}
