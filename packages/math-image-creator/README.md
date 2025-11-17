# Math Animation Creator

This project contains mathematical animations created with Manim to help visualize and understand key mathematical concepts like ratios, percentages, exponential growth, logarithms, and more.


## Setup

### 1. Create a Virtual Environment

First, create a virtual environment to keep dependencies isolated:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

### 2. Install Dependencies

Install Manim and other required packages:

```bash
# Upgrade pip
pip install --upgrade pip

# Install Manim and numpy
pip install manim numpy

```

## Running the Animations

The project contains 7 mathematical concept animations. Each animation can be rendered using Manim with different quality settings.

### Command Options

- `-pql` : Preview in low quality (480p, 15fps) - fastest rendering
- `-pqm` : Preview in medium quality (720p, 30fps)
- `-pqh` : Preview in high quality (1080p, 60fps)
- `-pqk` : Preview in 4K quality (2160p, 60fps) - slowest rendering

### Available Animations

The project contains two sets of animations - the original lesson files and alternate versions with different implementations.

#### Original Lesson Files

1. **Ratio vs Difference**
```bash
manim -pql lesson_2a_ratio_vs_difference.py RatioVsDifference
```

2. **Percents as Per-Hundreds**
```bash
manim -pql lesson_2b_percents.py PercentsAsPerHundreds
```

3. **Powers of Two (Doubling)**
```bash
manim -pql lesson_3a_doubling_power.py DoublingPower
```

4. **Orders of Magnitude**
```bash
manim -pql lesson_3b_orders_of_magnitude.py OrdersOfMagnitude
```

5. **Area Grows with Length Squared**
```bash
manim -pql lesson_4a_area_grows_squared.py AreaGrowsSquared
```

6. **Density = Mass / Volume**
```bash
manim -pql lesson_4b_density.py DensityMassVolume
```

7. **Logarithms as Doublings**
```bash
manim -pql lesson_5_logarithm_doublings.py LogarithmAsDoublings
```

#### Alternate Versions

1. **Ratio vs Difference**
   - Juice concentrate mixing example showing the difference between adding a fixed amount vs multiplying by a ratio.
```bash
manim -pql alternate_lesson_2a_ratio_vs_difference.py RatioVsDifference
```

2. **Percents as Per-Hundreds**
   - Battery charge and sale discount examples showing percents as fractions of 100.
```bash
manim -pql alternate_lesson_2b_percents.py PercentsPerHundreds
```

3. **Powers of Two (Doubling)**
   - Paper folding example demonstrating exponential growth through repeated doubling.
```bash
manim -pql alternate_lesson_3a_doubling_power.py DoublingPower
```

4. **Orders of Magnitude**
   - Visual journey from DNA to the Solar System showing powers of 10.
```bash
manim -pql alternate_lesson_3b_orders_of_magnitude.py OrdersOfMagnitude
```

5. **Area Grows with Length Squared**
   - Pizza pricing example showing how area is proportional to diameter squared.
```bash
manim -pql alternate_lesson_4a_area_grows_squared.py AreaGrowsSquared
```

6. **Density = Mass / Volume**
   - Styrofoam vs steel comparison illustrating the concept of density.
```bash
manim -pql alternate_lesson_4b_density.py DensityMassVolume
```

7. **Logarithms as "How Many Doublings?"**
   - Richter scale example connecting logarithms to multiplication.
```bash
manim -pql alternate_lesson_5_logarithms.py LogarithmsAsDoublings
```

### Running All Animations

To render all animations at once, you can use these scripts:

#### Original Lessons
```bash
# Low quality (fastest)
manim -pql lesson_2a_ratio_vs_difference.py RatioVsDifference
manim -pql lesson_2b_percents.py PercentsAsPerHundreds
manim -pql lesson_3a_doubling_power.py DoublingPower
manim -pql lesson_3b_orders_of_magnitude.py OrdersOfMagnitude
manim -pql lesson_4a_area_grows_squared.py AreaGrowsSquared
manim -pql lesson_4b_density.py DensityMassVolume
manim -pql lesson_5_logarithm_doublings.py LogarithmAsDoublings
```

#### Alternate Versions
```bash
# Low quality (fastest)
manim -pql alternate_lesson_2a_ratio_vs_difference.py RatioVsDifference
manim -pql alternate_lesson_2b_percents.py PercentsPerHundreds
manim -pql alternate_lesson_3a_doubling_power.py DoublingPower
manim -pql alternate_lesson_3b_orders_of_magnitude.py OrdersOfMagnitude
manim -pql alternate_lesson_4a_area_grows_squared.py AreaGrowsSquared
manim -pql alternate_lesson_4b_density.py DensityMassVolume
manim -pql alternate_lesson_5_logarithms.py LogarithmsAsDoublings
```

### Output Location

Rendered videos will be saved in:
```
media/videos/[filename]/[quality]/[ClassName].mp4
```

For example:
```
media/videos/alternate_lesson_2a_ratio_vs_difference/480p15/RatioVsDifference.mp4
```

## Customization

### Changing Quality

Replace `-pql` with:
- `-pqm` for 720p medium quality
- `-pqh` for 1080p high quality
- `-pqk` for 4K quality

### Rendering Without Preview

Remove the `-p` flag to render without automatically opening the video:
```bash
manim -ql alternate_lesson_2a_ratio_vs_difference.py RatioVsDifference
```

### Rendering Specific Parts

To render only a specific part of an animation, you can use the `-n` flag followed by the method name.

## Troubleshooting

### Common Issues

1. **ImportError**: Make sure you've activated the virtual environment and installed all dependencies.

2. **LaTeX errors**: Some animations use mathematical formulas. Install LaTeX:
   - macOS: `brew install --cask mactex-no-gui`
   - Ubuntu/Debian: `sudo apt install texlive-full`
   - Windows: Download MiKTeX from https://miktex.org/

3. **FFmpeg not found**: Manim requires FFmpeg for video rendering:
   - macOS: `brew install ffmpeg`
   - Ubuntu/Debian: `sudo apt install ffmpeg`
   - Windows: Download from https://ffmpeg.org/

## Project Structure

```
math-image-creator/
├── README.md
├── lesson_2a_ratio_vs_difference.py
├── lesson_2b_percents.py
├── lesson_3a_doubling_power.py
├── lesson_3b_orders_of_magnitude.py
├── lesson_4a_area_grows_squared.py
├── lesson_4b_density.py
├── lesson_5_logarithm_doublings.py
├── alternate_lesson_2a_ratio_vs_difference.py
├── alternate_lesson_2b_percents.py
├── alternate_lesson_3a_doubling_power.py
├── alternate_lesson_3b_orders_of_magnitude.py
├── alternate_lesson_4a_area_grows_squared.py
├── alternate_lesson_4b_density.py
├── alternate_lesson_5_logarithms.py
└── media/                  # Generated videos output directory
```

## Additional Resources

- [Manim Documentation](https://docs.manim.community/)
- [Manim Discord Community](https://discord.gg/mMRrZQW)
- [Manim GitHub Repository](https://github.com/ManimCommunity/manim)
