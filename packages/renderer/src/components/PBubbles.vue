<script lang="ts" setup>
import { isClient } from '@vueuse/core'
import { onMounted, onUnmounted, watch } from 'vue'
import type p5 from 'p5'
import { getActivePinia } from 'pinia'
interface Bubble { x: number; y: number; size: number; speed: number }

defineProps<{
  active: boolean
}>()

let sketchInstance: null | p5 = null

const sketch = (s: p5) => {
  const bubbles: Bubble[] = []// holds bubble objects
  const bubbleNum = 2// # of bubbles?
  const xVariation = 2// how much the bubbles move in the x direction
  // makes a new bubble at a specified index once its off screen
  function newBubble(index: number) {
    bubbles[index] = {
      x: s.random(window.innerWidth),
      y: window.innerHeight,
      size: s.random(3, 10),
      speed: 0,
    }
  }
  // move the bubbles based on their size
  function moveBubbles(bubble: Bubble) {
    bubble.x += s.random(-xVariation, xVariation)
    bubble.speed += bubble.size
    bubble.y -= bubble.speed
    // draw the bubble NOTE they must be integer values to draw to the canvas
    s.ellipse(
      Math.round(bubble.x),
      Math.round(bubble.y),
      Math.round(bubble.size),
      Math.round(bubble.size),
    )
  }
  // setup the canvas based on the window size
  s.setup = () => {
    const canvas = s.createCanvas(window.innerWidth, window.innerHeight)
    canvas.parent('stupidCanvas')
    // canvas.canvas.id = 'p5-bubbles'
    s.noStroke()
    // frameRate(10);
    // make random bubble objects {x,y,size,speed}
    for (let i = 0; i < bubbleNum; i++) {
      bubbles[i] = {
        x: s.random(window.innerWidth),
        y: s.random(window.innerHeight),
        size: s.random(3, 10),
        speed: 0,
      }
    }
    // set color of the bubbles 'feel free to play with opacity, I think .4 looks nice'
    s.fill('rgba(255,255,255, 0.4)')
  }
  s.draw = () => {
    // console.log('bubbles still running!')
    s.clear(0, 0, 0, 0)
    // fill(255,0,0,127);
    bubbles.forEach((bub, index) => {
      moveBubbles(bub)
      if (bub.y < -10)
        newBubble(index)
    })
  }
  // handle window resize events and fix the canvas
  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight)
  }
}
onMounted(async () => {
  if (!isClient)
    return
  const { default: p5 } = await import('p5')
  // eslint-disable-next-line new-cap
  sketchInstance = new p5(sketch)
})

onUnmounted(() => {
  console.log('deactiavted in bubble')
  if (!isClient)
    return
  if (sketchInstance)
    sketchInstance.remove()
})

</script>

<template>
  <div />
</template>

<style>
#p5-bubbles{
  position: fixed;
  top:0px;
  left:0px;
}
</style>
