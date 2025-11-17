from manim import *

class NumberLineBasics(Scene):
    def construct(self):
        # Create the number line
        number_line = NumberLine(
            x_range=[-5, 5, 1],
            length=10,
            include_numbers=True,
            numbers_to_include=range(-4, 5),
            unit_size=1.0,
            color=WHITE,
            include_ticks=True,
            tick_size=0.1
        )
        
        # Position the number line
        number_line.move_to(ORIGIN)
        
        # Highlight the origin (0 point)
        origin_dot = Dot(number_line.number_to_point(0), color=RED, radius=0.1)
        origin_label = Text("Origin (0)", font_size=24, color=RED)
        origin_label.next_to(origin_dot, DOWN, buff=0.3)
        
        # Create title text
        title = Text("Number Line Basics", font_size=36, color=BLUE)
        title.to_edge(UP, buff=0.5)
        
        # Create direction text
        direction_text = Text("Right for Positive, Left for Negative", font_size=28, color=GREEN)
        direction_text.next_to(number_line, DOWN, buff=1.0)
        
        # Create moving point
        moving_point = Dot(number_line.number_to_point(0), color=YELLOW, radius=0.08)
        
        # Animation sequence
        # 1. Show the number line
        self.play(Create(number_line), run_time=2)
        self.wait(0.5)
        
        # 2. Show title
        self.play(Write(title), run_time=1)
        self.wait(0.5)
        
        # 3. Highlight the origin
        self.play(Create(origin_dot), Write(origin_label), run_time=1.5)
        self.wait(1)
        
        # 4. Show direction text
        self.play(Write(direction_text), run_time=2)
        self.wait(1)
        
        # 5. Show moving point at origin
        self.play(Create(moving_point), run_time=0.5)
        self.wait(0.5)
        
        # 6. Move point from 0 to 3 (positive direction)
        positive_label = Text("Moving to +3", font_size=20, color=YELLOW)
        positive_label.next_to(number_line, UP, buff=0.5)
        
        self.play(Write(positive_label), run_time=0.5)
        self.play(
            moving_point.animate.move_to(number_line.number_to_point(3)),
            run_time=2
        )
        self.wait(1)
        
        # 7. Move point back to origin
        self.play(
            moving_point.animate.move_to(number_line.number_to_point(0)),
            FadeOut(positive_label),
            run_time=1.5
        )
        self.wait(0.5)
        
        # 8. Move point from 0 to -2 (negative direction)
        negative_label = Text("Moving to -2", font_size=20, color=YELLOW)
        negative_label.next_to(number_line, UP, buff=0.5)
        
        self.play(Write(negative_label), run_time=0.5)
        self.play(
            moving_point.animate.move_to(number_line.number_to_point(-2)),
            run_time=2
        )
        self.wait(1)
        
        # 9. Final pause and fade out
        self.play(
            moving_point.animate.move_to(number_line.number_to_point(0)),
            FadeOut(negative_label),
            run_time=1.5
        )
        self.wait(1)
        
        # Final highlight of the concept
        emphasis_text = Text("Zero is the center - positive right, negative left!", 
                           font_size=24, color=ORANGE)
        emphasis_text.next_to(direction_text, DOWN, buff=0.5)
        
        self.play(Write(emphasis_text), run_time=2)
        self.wait(2)
        
        # Fade out all elements
        self.play(
            FadeOut(number_line),
            FadeOut(origin_dot),
            FadeOut(origin_label),
            FadeOut(title),
            FadeOut(direction_text),
            FadeOut(emphasis_text),
            FadeOut(moving_point),
            run_time=2
        )
        self.wait(1)