export const Stack = () => {
    const stack = [];
    const push = (item) => {
        stack.push(item);
    }

    const pop = () => {
        return stack.pop();
    }

    const top = () => {
        return stack[stack.length - 1];
    }

    const empty = () => {
        return !stack.length;
    }

    return {
       push,
       pop,
       top,
       empty
    }
}