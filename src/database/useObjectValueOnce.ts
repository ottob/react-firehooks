import { DataSnapshot, get, Query } from "firebase/database";
import { useCallback } from "react";
import { ValueHookResult } from "../common";
import { useOnce } from "../internal/useOnce";
import { isQueryEqual } from "./internal";

export type UseObjectValueOnceResult<Value = unknown> = ValueHookResult<Value, Error>;

export type UseObjectValueOnceConverter<Value> = (snap: DataSnapshot) => Value;

export interface UseObjectValueOnceOptions<Value> {
    converter?: UseObjectValueOnceConverter<Value>;
}

/**
 * Returns the DataSnapshot of the Realtime Database query. Does not update the DataSnapshot once initially fetched
 *
 * @template Value Type of the object value
 * @param {Query | undefined | null} query Realtime Database query
 * @param {?UseObjectValueOnceOptions} options Options to configure how the object is fetched
 * * `converter`: Function to extract the desired data from the DataSnapshot. Similar to Firestore converters. Default: `snap.val()`.
 * @returns {UseObjectValueOnceResult} User, loading state, and error
 * * value: Object value; `undefined` if query is currently being fetched, or an error occurred
 * * loading: `true` while fetching the query; `false` if the query was fetched successfully or an error occurred
 * * error: `undefined` if no error occurred
 */
export function useObjectValueOnce<Value = unknown>(
    query: Query | undefined | null,
    options?: UseObjectValueOnceOptions<Value>
): UseObjectValueOnceResult<Value> {
    const { converter = (snap: DataSnapshot) => snap.val() } = options ?? {};

    const getData = useCallback(async (stableQuery: Query) => {
        const snap = await get(stableQuery);
        return converter(snap);
    }, []);

    return useOnce(query ?? undefined, getData, isQueryEqual);
}
