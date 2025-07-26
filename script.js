const arrayContainer = document.getElementById('arrayContainer');
const visualizeBtn = document.getElementById('visualizeBtn');
const generateBtn = document.getElementById('generateBtn');
const algorithmSelect = document.getElementById('algorithmSelect');
const arraySizeInput = document.getElementById('arraySize');

let array = [];

function setControlsDisabled(state) {
  visualizeBtn.disabled = state;
  generateBtn.disabled = state;
  algorithmSelect.disabled = state;
  arraySizeInput.disabled = state;
}

function generateArray(size = 30) {
  array = [];
  for (let i = 0; i < size; i++) {
    // Random height between 20 and 350 px for better visibility
    array.push(Math.floor(Math.random() * 330) + 20);
  }
  renderArray();
}

function renderArray(highlightIndices = [], swappingIndices = [], sortedIndices = []) {
  arrayContainer.innerHTML = '';
  array.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.classList.add('array-bar');
    if (swappingIndices.includes(index)) {
      bar.classList.add('swapping');
    } else if (sortedIndices.includes(index)) {
      bar.classList.add('sorted');
    } else if (highlightIndices.includes(index)) {
      bar.style.backgroundColor = '#ffa500'; // orange highlight for compare
    }
    bar.style.height = `${value}px`;
    arrayContainer.appendChild(bar);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Bubble Sort
async function bubbleSort() {
  const n = array.length;
  let sortedIndices = [];
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      renderArray([j, j+1], [j, j+1], sortedIndices);
      await sleep(50);
      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        renderArray([], [j, j+1], sortedIndices);
        await sleep(50);
      }
    }
    sortedIndices.push(n - 1 - i);
  }
  sortedIndices = Array.from({length: n}, (_, i) => i);
  renderArray([], [], sortedIndices);
}

// Selection Sort
async function selectionSort() {
  const n = array.length;
  let sortedIndices = [];
  for (let i = 0; i < n; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      renderArray([minIndex, j], [minIndex, j], sortedIndices);
      await sleep(50);
      if (array[j] < array[minIndex]) {
        minIndex = j;
        renderArray([minIndex], [minIndex], sortedIndices);
        await sleep(50);
      }
    }
    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
      renderArray([], [i, minIndex], sortedIndices);
      await sleep(50);
    }
    sortedIndices.push(i);
  }
  renderArray([], [], sortedIndices);
}

// Insertion Sort
async function insertionSort() {
  const n = array.length;
  let sortedIndices = [];
  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      renderArray([j, j+1], [j, j+1], sortedIndices);
      await sleep(50);
      array[j + 1] = array[j];
      renderArray([], [j, j+1], sortedIndices);
      await sleep(50);
      j--;
    }
    array[j + 1] = key;
    sortedIndices = Array.from({length: i + 1}, (_, idx) => idx);
    renderArray([], [], sortedIndices);
    await sleep(30);
  }
  sortedIndices = Array.from({length: n}, (_, i) => i);
  renderArray([], [], sortedIndices);
}

// Merge Sort helpers and visualizer
async function merge(arr, l, m, r) {
  let n1 = m - l + 1;
  let n2 = r - m;

  let L = [], R = [];
  for(let i = 0; i < n1; i++) L[i] = arr[l + i];
  for(let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

  let i = 0, j = 0, k = l;

  while(i < n1 && j < n2) {
    renderArray([k], [k], []);
    await sleep(50);
    if(L[i] <= R[j]) {
      arr[k] = L[i];
      i++;
    } else {
      arr[k] = R[j];
      j++;
    }
    renderArray([k], [k], []);
    await sleep(50);
    k++;
  }

  while(i < n1) {
    arr[k] = L[i];
    renderArray([k], [k], []);
    await sleep(50);
    i++; k++;
  }

  while(j < n2) {
    arr[k] = R[j];
    renderArray([k], [k], []);
    await sleep(50);
    j++; k++;
  }
}

async function mergeSortUtil(arr, l, r) {
  if(l >= r) return;
  let m = Math.floor((l+r)/2);
  await mergeSortUtil(arr, l, m);
  await mergeSortUtil(arr, m+1, r);
  await merge(arr, l, m, r);
}

async function mergeSort() {
  await mergeSortUtil(array, 0, array.length -1);
  renderArray([], [], Array.from(array.keys()));
}

// Quick Sort helpers and visualizer
async function partition(arr, low, high) {
  let pivot = arr[high];
  let i = low -1;
  for(let j = low; j < high; j++) {
    renderArray([j, high], [j, high], []);
    await sleep(50);
    if(arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      renderArray([], [i, j], []);
      await sleep(50);
    }
  }
  [arr[i+1], arr[high]] = [arr[high], arr[i+1]];
  renderArray([], [i+1, high], []);
  await sleep(50);
  return i+1;
}

async function quickSortUtil(arr, low, high) {
  if(low < high) {
    let pi = await partition(arr, low, high);
    await quickSortUtil(arr, low, pi - 1);
    await quickSortUtil(arr, pi + 1, high);
  }
}
async function quickSort() {
  await quickSortUtil(array, 0, array.length -1);
  renderArray([], [], Array.from(array.keys()));
}

visualizeBtn.addEventListener('click', async () => {
  if(array.length === 0) {
    generateArray(arraySizeInput.value);
  }
  const algo = algorithmSelect.value;
  if (!algo) {
    alert("Please select an algorithm!");
    return;
  }

  setControlsDisabled(true);
  // initial render
  renderArray();
  await sleep(400);

  if(algo === 'bubbleSort') {
    await bubbleSort();
  } else if(algo === 'selectionSort') {
    await selectionSort();
  } else if(algo === 'insertionSort') {
    await insertionSort();
  } else if(algo === 'mergeSort') {
    await mergeSort();
  } else if(algo === 'quickSort') {
    await quickSort();
  } else {
    alert('Selected algorithm is under development.');
  }

  setControlsDisabled(false);
});

generateBtn.addEventListener('click', () => {
  generateArray(parseInt(arraySizeInput.value) || 30);
});

// Initialize on load
window.onload = () => {
  generateArray(parseInt(arraySizeInput.value) || 30);
};
