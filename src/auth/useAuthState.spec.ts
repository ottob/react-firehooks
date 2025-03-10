import { Auth, onAuthStateChanged, User } from "firebase/auth";
import { renderHook } from "@testing-library/react-hooks";
import { useAuthState } from "./useAuthState";
import { newSymbol } from "../__testfixtures__";

jest.mock("firebase/auth", () => {
    const actual = jest.requireActual("firebase/auth");

    return {
        ...actual,
        onAuthStateChanged: jest.fn(),
    };
});

const onAuthStateChangedMock = onAuthStateChanged as jest.Mock<
    ReturnType<typeof onAuthStateChanged>,
    Parameters<typeof onAuthStateChanged>
>;

beforeEach(() => {
    jest.resetAllMocks();
});

describe("initial state", () => {
    it("should return currentUser when defined", () => {
        const currentUser = newSymbol<User>("Current User");
        const mockAuth = { currentUser } as Auth;

        onAuthStateChangedMock.mockImplementation(() => () => {});

        const { result } = renderHook(() => useAuthState(mockAuth));
        expect(result.current).toStrictEqual([currentUser, false, undefined]);
    });

    it("should return undefined when currentUser is null", () => {
        const mockAuth = { currentUser: null } as Auth;

        onAuthStateChangedMock.mockImplementation(() => () => {});

        const { result } = renderHook(() => useAuthState(mockAuth));
        expect(result.current).toStrictEqual([undefined, true, undefined]);
    });
});
