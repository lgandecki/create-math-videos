from manim import *

class RatioVsDifference(Scene):
    def construct(self):
        # Title
        title = Text("Proporcja vs. Różnica", font_size=48)
        subtitle = Text("Rozcieńczyć 2x ≠ Dodać tyle samo wody", font_size=24, color=GRAY)
        title_group = VGroup(title, subtitle).arrange(DOWN)
        self.play(Write(title), FadeIn(subtitle))
        self.wait(1)
        self.play(FadeOut(title_group))

        # Create two identical glasses
        glass_width = 1.5
        glass_height = 3
        
        # Left glass (Difference)
        left_glass = Rectangle(width=glass_width, height=glass_height, color=WHITE)
        left_glass.shift(LEFT * 3)
        left_label = Text("Różnica", font_size=24).next_to(left_glass, DOWN, buff=0.5)
        
        # Right glass (Ratio)
        right_glass = Rectangle(width=glass_width, height=glass_height, color=WHITE)
        right_glass.shift(RIGHT * 3)
        right_label = Text("Proporcja", font_size=24).next_to(right_glass, DOWN, buff=0.5)
        
        # Initial concentrate (dark blue) - half filled
        concentrate_height = glass_height / 2
        left_concentrate = Rectangle(
            width=glass_width, 
            height=concentrate_height,
            fill_color=DARK_BLUE,
            fill_opacity=0.8,
            stroke_width=0
        )
        left_concentrate.align_to(left_glass, DOWN).shift(UP * 0)
        
        right_concentrate = Rectangle(
            width=glass_width,
            height=concentrate_height,
            fill_color=DARK_BLUE,
            fill_opacity=0.8,
            stroke_width=0
        )
        right_concentrate.align_to(right_glass, DOWN).shift(UP * 0)
        
        # Labels for concentrate
        concentrate_label = Text("Koncentrat", font_size=20, color=DARK_BLUE)
        concentrate_label.move_to(UP * 3.5)
        
        # Show glasses and initial concentrate
        self.play(
            Create(left_glass), Create(right_glass),
            FadeIn(left_label), FadeIn(right_label)
        )
        self.play(
            FadeIn(left_concentrate), FadeIn(right_concentrate),
            Write(concentrate_label)
        )
        self.wait(1)

        # LEFT GLASS: Add the same amount of water
        water_height = concentrate_height  # Same amount as concentrate
        left_water = Rectangle(
            width=glass_width,
            height=water_height,
            fill_color=BLUE_C,
            fill_opacity=0.6,
            stroke_width=0
        )
        left_water.align_to(left_concentrate, UP).shift(UP * 0)
        
        # Animate pouring water into left glass
        left_water_label = Text("+100 ml wody", font_size=20, color=BLUE)
        left_water_label.next_to(left_glass, RIGHT, buff=0.3)
        
        self.play(
            GrowFromEdge(left_water, DOWN),
            Write(left_water_label),
            run_time=2
        )
        
        # Create mixed liquid for left glass (medium blue)
        left_mixed = Rectangle(
            width=glass_width,
            height=glass_height,
            fill_color=BLUE,
            fill_opacity=0.7,
            stroke_width=0
        )
        left_mixed.align_to(left_glass, DOWN).shift(UP * 0)
        
        # Mix animation for left glass
        self.play(
            FadeOut(left_concentrate),
            FadeOut(left_water),
            FadeIn(left_mixed),
            run_time=1
        )
        self.wait(0.5)

        # RIGHT GLASS: Double the volume (2x dilution)
        # Calculate new heights for 2x dilution
        new_total_height = concentrate_height * 2  # Double the original volume
        water_for_2x = new_total_height - concentrate_height
        
        right_water = Rectangle(
            width=glass_width,
            height=water_for_2x,
            fill_color=BLUE_C,
            fill_opacity=0.6,
            stroke_width=0
        )
        right_water.align_to(right_concentrate, UP).shift(UP * 0)
        
        # Animate 2x dilution
        right_water_label = Text("x2 rozcieńczenie", font_size=20, color=BLUE)
        right_water_label.next_to(right_glass, LEFT, buff=0.3)
        
        self.play(
            GrowFromEdge(right_water, DOWN),
            Write(right_water_label),
            run_time=2
        )
        
        # Create mixed liquid for right glass (lighter blue than left)
        right_mixed = Rectangle(
            width=glass_width,
            height=new_total_height,
            fill_color=BLUE_C,
            fill_opacity=0.5,
            stroke_width=0
        )
        right_mixed.align_to(right_glass, DOWN).shift(UP * 0)
        
        # Mix animation for right glass
        self.play(
            FadeOut(right_concentrate),
            FadeOut(right_water),
            FadeIn(right_mixed),
            run_time=1
        )
        self.wait(1)

        # Move glasses to center for comparison
        self.play(
            VGroup(left_glass, left_mixed, left_label, left_water_label).animate.shift(RIGHT * 1.5),
            VGroup(right_glass, right_mixed, right_label, right_water_label).animate.shift(LEFT * 1.5),
            FadeOut(concentrate_label)
        )
        
        # Final message
        final_message = Text("Dodawanie to nie to samo co mnożenie", font_size=32, color=YELLOW)
        final_message.to_edge(DOWN, buff=1)
        
        # Highlight the color difference
        highlight_left = SurroundingRectangle(left_mixed, color=YELLOW, buff=0.1)
        highlight_right = SurroundingRectangle(right_mixed, color=YELLOW, buff=0.1)
        
        self.play(
            Create(highlight_left),
            Create(highlight_right),
            Write(final_message)
        )
        
        self.wait(3)