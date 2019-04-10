function autocomplete(input, latInput, lngInput) {
  if(!input) {
    return;
  }

  const dropdown = new google.maps.places.Autocomplete(input);

  dropdown.addListener('place_change', () => {
    const place = dropdown.getPlace();

    latInput.value = place.geometry.location.lat();
    lngInput.value = place.geometry.location.lng();

  });

  input.on('keydown', (event) => {
    if(event.keyCode === 13) {
      event.preventDefault;
    }
  });
}

export default autocomplete;
