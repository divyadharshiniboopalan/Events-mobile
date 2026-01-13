
export const getAddressFromPlaceObject = (details) => {
    const address = {
        street_number: "",
        street: "",
        neighborhood: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
        lat: "",
        lng: "",
    }
    details.address_components.forEach(function (component) {
        component.types.forEach(function (type) {
            if (type === 'street_number') {
                address.street_number = component.long_name
            }
            if (type === 'sublocality_level_2' || type === 'route') {
                address.street = component.long_name
            }
            if (type === 'neighborhood') {
                address.neighborhood = component.long_name
            }
            if (type === 'administrative_area_level_2' || type === 'locality') {
                address.city = component.long_name
            }
            if (type === 'administrative_area_level_1') {
                address.state = component.long_name
            }
            if (type === 'country') {
                address.country = component.long_name
            }
            if (type === 'postal_code') {
                address.postal_code = component.long_name
            }
        });
    });
    return { ...address, ...details.geometry.location }
}
