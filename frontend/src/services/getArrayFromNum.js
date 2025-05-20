import React from 'react'

export default function getArrayFromNum(num) {
   return new Array(num).fill().map((_, i) => i + 1);
}
