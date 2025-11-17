from manim import *
import numpy as np

class CircularSlideRule(Scene):
    def construct(self):
        # Create outer circle (stationary)
        outer_radius = 3
        outer_circle = Circle(radius=outer_radius, color=BLUE, stroke_width=6)
        
        # Create inner circle (will rotate)
        inner_radius = 2.5
        inner_circle = Circle(radius=inner_radius, color=RED, stroke_width=4)
        
        # Add tick marks to outer circle
        outer_ticks = VGroup()
        for i in range(36):  # 36 ticks, every 10 degrees
            angle = i * 10 * DEGREES
            if i % 3 == 0:  # Every 30 degrees, make longer tick
                start = outer_radius * 0.9
                end = outer_radius * 1.1
            else:
                start = outer_radius * 0.95
                end = outer_radius * 1.05
            
            tick = Line(
                start=start * np.array([np.cos(angle), np.sin(angle), 0]),
                end=end * np.array([np.cos(angle), np.sin(angle), 0]),
                color=BLUE,
                stroke_width=2
            )
            outer_ticks.add(tick)
        
        # Add numbers to outer circle
        outer_numbers = VGroup()
        for i in range(12):  # Numbers 0-11
            angle = i * 30 * DEGREES
            number = Text(str(i), font_size=24, color=BLUE)
            number.move_to(outer_radius * 1.25 * np.array([np.cos(angle), np.sin(angle), 0]))
            outer_numbers.add(number)
        
        # Add tick marks to inner circle
        inner_ticks = VGroup()
        for i in range(24):  # 24 ticks, every 15 degrees
            angle = i * 15 * DEGREES
            if i % 2 == 0:  # Every 30 degrees, make longer tick
                start = inner_radius * 0.85
                end = inner_radius * 0.95
            else:
                start = inner_radius * 0.9
                end = inner_radius * 0.95
            
            tick = Line(
                start=start * np.array([np.cos(angle), np.sin(angle), 0]),
                end=end * np.array([np.cos(angle), np.sin(angle), 0]),
                color=RED,
                stroke_width=2
            )
            inner_ticks.add(tick)
        
        # Add some numbers to inner circle
        inner_numbers = VGroup()
        for i in range(8):  # Numbers 0-7
            angle = i * 45 * DEGREES
            number = Text(str(i), font_size=20, color=RED)
            number.move_to(inner_radius * 0.7 * np.array([np.cos(angle), np.sin(angle), 0]))
            inner_numbers.add(number)
        
        # Group inner elements together so they rotate as one
        inner_group = VGroup(inner_circle, inner_ticks, inner_numbers)
        
        # Add a center dot
        center_dot = Dot(point=ORIGIN, radius=0.1, color=WHITE)
        
        # Add a reference line/pointer
        pointer = Line(
            start=ORIGIN,
            end=outer_radius * 1.15 * RIGHT,
            color=YELLOW,
            stroke_width=4
        )
        
        # Animate the construction
        self.play(Create(outer_circle))
        self.play(Create(outer_ticks), run_time=0.5)
        self.play(FadeIn(outer_numbers), run_time=0.5)
        
        self.play(Create(inner_circle))
        self.play(Create(inner_ticks), run_time=0.5)
        self.play(FadeIn(inner_numbers), run_time=0.5)
        
        self.play(FadeIn(center_dot), Create(pointer))
        
        self.wait(1)
        
        # Rotate the inner circle
        self.play(
            Rotate(inner_group, angle=60 * DEGREES, about_point=ORIGIN),
            run_time=2
        )
        self.wait(0.5)
        
        # Rotate back and forth a few times
        self.play(
            Rotate(inner_group, angle=-90 * DEGREES, about_point=ORIGIN),
            run_time=2
        )
        self.wait(0.5)
        
        self.play(
            Rotate(inner_group, angle=120 * DEGREES, about_point=ORIGIN),
            run_time=2
        )
        self.wait(0.5)
        
        # Continuous rotation
        self.play(
            Rotate(inner_group, angle=360 * DEGREES, about_point=ORIGIN),
            run_time=4,
            rate_func=linear
        )
        
        self.wait(1)