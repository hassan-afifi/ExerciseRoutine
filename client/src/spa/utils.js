export function unwrapCollection(response) {
    return {
        items: response.data.data ?? [],
        links: response.data.links ?? null,
        meta: response.data.meta ?? null,
    };
}

export function unwrapItem(response) {
    return response.data.data ?? response.data;
}

export function extractErrorMessage(error, fallbackMessage = 'Something went wrong.') {
    const responseData = error?.response?.data;
    if (responseData?.message) {
        return responseData.message;
    }

    const errors = responseData?.errors;
    if (errors && typeof errors === 'object') {
        const firstEntry = Object.values(errors)[0];
        if (Array.isArray(firstEntry) && firstEntry.length > 0) {
            return firstEntry[0];
        }
    }

    return fallbackMessage;
}
