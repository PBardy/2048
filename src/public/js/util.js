// Generate random integer between a min and max value.
export function randInt(min, max) {
  return Math.floor(Math.random() * max) + min;
}

// Determine if a value lies between a min and max value.
export function inRange(value, min, max) {
  return value >= min && value <= max;
}

// Pad numbers to a specific length, with a specific character.
export function padStart(string, padding, amount) {

  // Construct a string, with length amount, comprised of the padding character.
  let padded = "";
  for(let i = 0; i < amount - 1; i++) {
    padded += padding;
  }
  padded += string ? string : padding;
  return padded.substr(padded.length - amount);
}

// Set a cookie to expire in a certain number of days
export function setCookie(cname, cvalue, exdays = 30) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

// Retrieve a cookie labelled with a given name and return its value
// as a string.
export function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}