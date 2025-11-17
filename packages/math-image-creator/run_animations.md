# How to Run the Math Animations

## Prerequisites

Make sure you have the virtual environment activated and Manim installed:

```bash
source venv/bin/activate
```

## Running Individual Animations

To run any animation, use the following command format:

```bash
manim -pql <filename> <ClassName>
```

- `-p` : Preview the animation after rendering
- `-q` : Quality setting
- `-l` : Low quality (480p, 15fps) - fast rendering for preview

### Available Animations

1. **Lesson 2a: Ratio vs Difference**
   ```bash
   manim -pql lesson_2a_ratio_vs_difference.py RatioVsDifference
   ```
   Shows how diluting 2x is different from adding the same amount of water.

2. **Lesson 2b: Percents = Per-Hundreds**
   ```bash
   manim -pql lesson_2b_percents.py PercentsAsPerHundreds
   ```
   Demonstrates that percentages are just fractions out of 100.

3. **Lesson 3a: Doubling Power**
   ```bash
   manim -pql lesson_3a_doubling_power.py DoublingPower
   ```
   Shows the shocking nature of exponential growth through paper folding.

4. **Lesson 3b: Orders of Magnitude**
   ```bash
   manim -pql lesson_3b_orders_of_magnitude.py OrdersOfMagnitude
   ```
   Builds intuition for powers of 10 scaling.

5. **Lesson 4a: Area grows with length²**
   ```bash
   manim -pql lesson_4a_area_grows_squared.py AreaGrowsSquared
   ```
   Visual proof that doubling linear dimension quadruples area (pizza example).

6. **Lesson 4b: Density = mass/volume**
   ```bash
   manim -pql lesson_4b_density.py DensityMassVolume
   ```
   Shows that bigger doesn't always mean heavier.

7. **Lesson 5: Logarithm as doublings**
   ```bash
   manim -pql lesson_5_logarithm_doublings.py LogarithmAsDoublings
   ```
   Simple, intuitive definition of logarithm as counting multiplications.

## Quality Options

Replace `-l` with other quality options:
- `-l` : Low quality (480p, 15fps) - fastest
- `-m` : Medium quality (720p, 30fps)
- `-h` : High quality (1080p, 60fps)
- `-k` : 4K quality (2160p, 60fps) - slowest

## Output Location

Rendered videos are saved in:
```
media/videos/<filename_without_py>/<quality>/<ClassName>.mp4
```

## Running All Animations

To run all animations in sequence:

```bash
for file in lesson_*.py; do
    class_name=$(grep "^class" "$file" | head -1 | cut -d' ' -f2 | cut -d'(' -f1)
    echo "Running $file with class $class_name"
    manim -pql "$file" "$class_name"
done
```

## Troubleshooting

1. **LaTeX Error**: Some animations use LaTeX for mathematical formulas. If you get LaTeX errors, install BasicTeX:
   ```bash
   brew install --cask basictex
   ```

2. **SVG Error**: The battery animation in lesson_2b uses SVG. Since we don't have a hand SVG, it uses a simple circle instead.

3. **Slow Rendering**: Use `-l` (low quality) for faster preview. Once satisfied, render in higher quality.

## Notes

- Each animation tells a specific mathematical story
- Animations are in Polish with some English subtitles
- Colors and timing are chosen for educational clarity
- All animations work without LaTeX dependencies