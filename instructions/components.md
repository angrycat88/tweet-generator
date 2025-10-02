# Component Guidelines

## UI Components
#### Original Text Textarea

- **Component**: `<Textarea>` from shadcn/ui
- **Props**:

- `value={originalText}`
- `onChange={(e) => setOriginalText(e.target.value)}`
- `placeholder="Paste your long text here..."`



- **Styling**:

- Fixed height: `min-h-[200px] max-h-[200px]`
- No resize: `resize-none`
- White background: `bg-background`
- Text size: `text-base`

#### AI Guidance Input

- **Component**: `<Input>` from shadcn/ui
- **Props**:

- `value={aiGuidance}`
- `onChange={(e) => setAiGuidance(e.target.value)}`
- `placeholder="e.g., Make it more casual, add emojis..."`



- **Styling**:

- White background: `bg-background`
- Text size: `text-base`

#### Tweet Count Slider

- **Component**: `<Slider>` from shadcn/ui
- **Props**:

- `min={1}`, `max={10}`, `step={1}`
- `value={[tweetCount]}`
- `onValueChange={(value) => setTweetCount(value[0])}`



- **Layout**: Flexbox with number input

- Slider takes flex-1
- Number input: `w-20`
- Gap: `gap-4`

####  Number Input (paired with slider)

- **Component**: `<Input type="number">`
- **Props**:

- `min={1}`, `max={10}`
- `value={tweetCount}`
- `onChange={(e) => setTweetCount(Number(e.target.value))}`

#### Generate Threads Checkbox

- **Component**: `<Checkbox>` from shadcn/ui
- **Props**:

- `checked={generateThreads}`
- `onCheckedChange={(checked) => setGenerateThreads(checked as boolean)}`



- **Layout**: Flex with label, `space-x-2`

#### Generate Button

- **Component**: `<Button>` from shadcn/ui
- **Props**:

- `onClick={handleGenerate}`
- `disabled={!originalText.trim()}`
- `size="lg"`



- **Styling**: `px-8` for extra padding

#### Tweet Card

- **Component**: `<Card>` from shadcn/ui
- **Styling**:

- Padding: `p-6`
- Spacing: `space-y-4`
- Hover effect: `hover:shadow-lg transition-shadow`

Thought for 2sInspected UIThought for 1sRead component fileFixed import errorv4I've fixed the import error by replacing the lucide-react icons with inline SVG components. Now let me take a screenshot to see the working UI and then generate the Cursor instructions markdown file.

Viewed fixed UINow I'll generate the Cursor instructions markdown file based on the UI I've built.

```markdown
# Tweet Generator UI Design Instructions

## Overview
A clean, modern web application that converts long text into Twitter-sized tweets with optional thread generation. Uses a white background with blue accent colors for a professional, readable interface.

## Color Scheme
- **Primary Color**: Blue (`hsl(221.2 83.2% 53.3%)`)
- **Background**: White (`hsl(0 0% 100%)`)
- **Foreground Text**: Dark gray (`hsl(222.2 84% 4.9%)`)
- **Muted Text**: Gray (`hsl(215.4 16.3% 46.9%)`)
- **Border**: Light gray (`hsl(214.3 31.8% 91.4%)`)

## Layout Structure

### Page Container
- Max width: `max-w-7xl` (1280px)
- Padding: `px-4 py-8`
- Centered with `mx-auto`

### Two-Section Layout

#### 1. Input Section (Top)
- Margin bottom: `mb-12`
- Blue container with 2px border: `border-2 border-primary`
- Background: `bg-primary/5` (subtle blue tint)
- Padding: `p-6`
- Rounded corners: `rounded-lg`

#### 2. Output Section (Bottom)
- 3-column responsive grid:
  - Mobile: 1 column (`grid-cols-1`)
  - Tablet: 2 columns (`md:grid-cols-2`)
  - Desktop: 3 columns (`lg:grid-cols-3`)
- Gap between cards: `gap-6`

## Components & State

### Main Component: `TweetGenerator`
Client component (`"use client"`)

#### State Variables
```typescript
const [originalText, setOriginalText] = useState("")        // Main text input
const [aiGuidance, setAiGuidance] = useState("")           // Optional AI prompt
const [tweetCount, setTweetCount] = useState(3)            // Number of tweets (1-10)
const [generateThreads, setGenerateThreads] = useState(false) // Thread mode toggle
const [tweets, setTweets] = useState<Tweet[]>([])          // Generated tweets
const [copiedId, setCopiedId] = useState<string | null>(null) // Copy feedback
```

#### Tweet Interface

```typescript
interface Tweet {
  id: string
  text: string
  threadIndex?: number      // Position in thread (1, 2, 3...)
  totalInThread?: number    // Total tweets in thread
}
```

### Input Components

#### 1. Original Text Textarea

- **Component**: `<Textarea>` from shadcn/ui
- **Props**:

- `value={originalText}`
- `onChange={(e) => setOriginalText(e.target.value)}`
- `placeholder="Paste your long text here..."`



- **Styling**:

- Fixed height: `min-h-[200px] max-h-[200px]`
- No resize: `resize-none`
- White background: `bg-background`
- Text size: `text-base`





#### 2. AI Guidance Input

- **Component**: `<Input>` from shadcn/ui
- **Props**:

- `value={aiGuidance}`
- `onChange={(e) => setAiGuidance(e.target.value)}`
- `placeholder="e.g., Make it more casual, add emojis..."`



- **Styling**:

- White background: `bg-background`
- Text size: `text-base`





#### 3. Tweet Count Slider

- **Component**: `<Slider>` from shadcn/ui
- **Props**:

- `min={1}`, `max={10}`, `step={1}`
- `value={[tweetCount]}`
- `onValueChange={(value) => setTweetCount(value[0])}`



- **Layout**: Flexbox with number input

- Slider takes flex-1
- Number input: `w-20`
- Gap: `gap-4`





#### 4. Number Input (paired with slider)

- **Component**: `<Input type="number">`
- **Props**:

- `min={1}`, `max={10}`
- `value={tweetCount}`
- `onChange={(e) => setTweetCount(Number(e.target.value))}`





#### 5. Generate Threads Checkbox

- **Component**: `<Checkbox>` from shadcn/ui
- **Props**:

- `checked={generateThreads}`
- `onCheckedChange={(checked) => setGenerateThreads(checked as boolean)}`



- **Layout**: Flex with label, `space-x-2`


#### 6. Generate Button

- **Component**: `<Button>` from shadcn/ui
- **Props**:

- `onClick={handleGenerate}`
- `disabled={!originalText.trim()}`
- `size="lg"`



- **Styling**: `px-8` for extra padding


### Controls Row Layout

- Flexbox with wrap: `flex flex-wrap items-end gap-6`
- Slider section: `flex-1 min-w-[250px]`
- Checkbox and button: natural width


### Output Components

#### Tweet Card

- **Component**: `<Card>` from shadcn/ui
- **Styling**:

- Padding: `p-6`
- Spacing: `space-y-4`
- Hover effect: `hover:shadow-lg transition-shadow`





#### Card Structure (top to bottom):

1. **Thread Indicator** (conditional)

1. Only shows if `tweet.threadIndex` exists
2. Badge: `bg-primary text-primary-foreground`
3. Text: `{threadIndex}/{totalInThread}`
4. Font: `text-xs font-medium`
5. Padding: `px-2 py-1`
6. Rounded: `rounded`



2. **Tweet Text**

1. Paragraph: `text-base leading-relaxed`
2. Min height: `min-h-[100px]`
3. Color: `text-card-foreground`



3. **Footer** (border-top)

1. Border: `border-t border-border`
2. Padding top: `pt-4`
3. Flexbox: `flex items-center justify-between`
4. Left: Character count `{text.length}/280`
5. Right: Copy button

#### Copy Button

- **Component**: `<Button variant="outline" size="sm">`
- **Props**: `onClick={() => handleCopy(tweet)}`
- **States**:

- Default: Copy icon + "Copy"
- Copied: Check icon + "Copied" (2 second timeout)



- **Gap**: `gap-2` between icon and text

