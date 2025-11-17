# To run this code, save it as a .py file (e.g., growth_video.py)
# and execute the following command in your terminal:
# manim -pql growth_video.py FullIllustration

from manim import *
import math

# Color Palette
BG_COLOR = "#0D1117"  # GitHub Dark Background
TEXT_COLOR = "#C9D1D9" # GitHub Dark Text
ACCENT_COLOR_1 = "#58A6FF" # Blue
ACCENT_COLOR_2 = "#F778BA" # Pink
WHEAT_COLOR = "#F4D03F"

class FullIllustration(Scene):
    """
    This master scene combines the Pi and Exponential Growth illustrations
    into a single continuous video with transitions.
    """
    def construct(self):
        # Set a consistent background for the entire video
        self.camera.background_color = BG_COLOR

        # --- Part 1: The Elegance of Pi ---
        pi_scene = IllustratePiConstant()
        pi_scene.construct()
        self.add(*pi_scene.mobjects)
        self.wait(2)

        # Transition out
        self.play(FadeOut(*self.mobjects))
        self.wait(1)

        # --- Part 2: The Power of Exponential Growth ---
        growth_scene = IllustrateExponentialGrowth()
        growth_scene.construct()
        self.add(*growth_scene.mobjects)
        self.wait(4)


class IllustratePiConstant(Scene):
    """
    Scene to illustrate that the ratio of a circle's circumference
    to its diameter is the constant Pi.
    """
    def construct(self):
        self.camera.background_color = BG_COLOR
        
        # --- Initial Setup ---
        title = Text("The Elegance of π (Pi)", font_size=48, color=TEXT_COLOR).to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # --- Circle and its properties ---
        radius = ValueTracker(1.5)
        
        # Dynamic Circle
        circle = Circle(radius=radius.get_value(), color=ACCENT_COLOR_1, stroke_width=6).move_to(LEFT * 4)
        circle.add_updater(lambda m: m.become(Circle(radius=radius.get_value(), color=ACCENT_COLOR_1, stroke_width=6).move_to(LEFT * 4)))

        # Dynamic Diameter
        diameter = Line(
            circle.get_left(), circle.get_right(), color=ACCENT_COLOR_2, stroke_width=6
        )
        diameter.add_updater(lambda m: m.become(Line(circle.get_left(), circle.get_right(), color=ACCENT_COLOR_2, stroke_width=6)))
        
        # Dynamic Unrolled Circumference
        unrolled_line = Line(
            ORIGIN, RIGHT * 2 * PI * radius.get_value(), color=ACCENT_COLOR_1, stroke_width=6
        ).next_to(circle, DOWN, buff=1.5)
        unrolled_line.add_updater(lambda m: m.become(Line(ORIGIN, RIGHT * 2 * PI * radius.get_value(), color=ACCENT_COLOR_1, stroke_width=6).next_to(circle, DOWN, buff=1.5)))

        # --- Labels and Ratio ---
        diameter_label = Text("Diameter", font_size=32, color=ACCENT_COLOR_2).next_to(diameter, UP, buff=0.2)
        circumference_label = Text("Circumference", font_size=32, color=ACCENT_COLOR_1).next_to(unrolled_line, DOWN, buff=0.2)

        ratio_text = MathTex(r"\frac{\text{Circumference}}{\text{Diameter}} = \pi \approx 3.14", font_size=48, color=TEXT_COLOR).to_edge(RIGHT).shift(UP*0.5)

        self.play(Create(circle), Create(diameter))
        self.play(Write(diameter_label))
        self.wait(1)

        # Animate unrolling
        self.play(TransformFromCopy(circle, unrolled_line), run_time=2)
        self.play(Write(circumference_label))
        self.wait(1)

        self.play(Write(ratio_text))
        self.wait(1.5)

        # --- Animation Loop ---
        self.play(
            radius.animate.set_value(0.8),
            run_time=2,
            rate_func=there_and_back
        )
        self.wait(0.5)
        self.play(
            radius.animate.set_value(2.0),
            run_time=3,
            rate_func=there_and_back
        )
        self.wait(1)
        
        # Cleanup for scene combination
        self.mobjects = [title, circle, diameter, unrolled_line, diameter_label, circumference_label, ratio_text]


class IllustrateExponentialGrowth(Scene):
    """
    Scene to illustrate exponential growth using the wheat and chessboard problem.
    """
    def construct(self):
        self.camera.background_color = BG_COLOR
        
        # --- Introduction: The Chessboard ---
        title = Text("The Deception of Exponential Growth", font_size=48, color=TEXT_COLOR).to_edge(UP)
        self.play(Write(title))
        
        board = VGroup(*[
            Square(side_length=0.7).set_stroke(TEXT_COLOR, width=1)
            for _ in range(64)
        ]).arrange_in_grid(8, 8, buff=0)
        board.to_edge(DOWN, buff=0.5)
        
        self.play(DrawBorderThenFill(board), run_time=2)
        self.wait(1)

        # --- Early Squares (1-3) ---
        squares = board.submobjects
        grain_placements = [
            (0, 1), (1, 2), (2, 4), (7, 128) # Square index, grains
        ]
        
        for i, (square_index, num_grains) in enumerate(grain_placements):
            if i > 2: continue # Show first 3 only
            square = squares[square_index]
            label = Text(f"{num_grains}", font_size=20, color=BG_COLOR).move_to(square.get_center())
            grains = VGroup(*[Dot(color=WHEAT_COLOR, radius=0.03) for _ in range(num_grains)]).arrange_in_grid(int(math.sqrt(num_grains)), int(math.sqrt(num_grains)), buff=0.05).move_to(square.get_center())
            self.play(FadeIn(grains, scale=0.5), Write(label), run_time=0.7)
            self.wait(0.5)
        
        text_manageable = Text("Seems manageable...", font_size=36, color=TEXT_COLOR).next_to(title, DOWN, buff=0.5)
        self.play(Write(text_manageable))
        self.wait(1)
        self.play(FadeOut(text_manageable))

        # --- The Jump to Square 20 ---
        pause_text = Text("But what about the 20th square?", font_size=40, color=ACCENT_COLOR_1).center()
        self.play(FadeIn(pause_text))
        self.wait(2
