from manim import *
import numpy as np


class SineWaveVisualization(Scene):
    def construct(self):
        # Start with a new scene - clear everything
        
        # Create unit circle on the left
        unit_circle = Circle(radius=1.5, color=BLUE, stroke_width=2)
        unit_circle.shift(3.5 * LEFT)
        
        # Create axes on the right for the sine wave graph
        axes = Axes(
            x_range=[0, 2*PI + 0.3, PI/2],
            y_range=[-1.5, 1.5, 0.5],
            x_length=5.5,
            y_length=3.5,
            axis_config={"include_tip": True, "color": WHITE}
        )
        axes.shift(1.5 * RIGHT)
        
        # Add axis labels using MathTex with proper LaTeX syntax
        x_label = MathTex(r"\text{Angle } (\theta)", font_size=32)
        x_label.next_to(axes.x_axis, DOWN, buff=0.3)
        
        y_label = MathTex(r"\text{Amplitude}", font_size=32)
        y_label.next_to(axes.y_axis, LEFT, buff=0.3).rotate(PI/2)
        
        # Create parameter tracker for animation
        theta_tracker = ValueTracker(0)
        
        # Create moving point on unit circle
        moving_point = Dot(color=RED, radius=0.1)
        moving_point.add_updater(
            lambda dot: dot.move_to(
                unit_circle.get_center() + 1.5 * np.array([
                    np.cos(theta_tracker.get_value()), 
                    np.sin(theta_tracker.get_value()), 
                    0
                ])
            )
        )
        
        # Create projection point on sine wave graph
        sine_point = Dot(color=RED, radius=0.08)
        sine_point.add_updater(
            lambda dot: dot.move_to(
                axes.coords_to_point(theta_tracker.get_value(), np.sin(theta_tracker.get_value()))
            )
        )
        
        # Create traced sine wave using TracedPath
        sine_wave_trace = TracedPath(
            sine_point.get_center, 
            stroke_color=GREEN, 
            stroke_width=4
        )
        
        # Create horizontal projection line (y-coordinate projects horizontally to graph)
        projection_line = always_redraw(
            lambda: DashedLine(
                moving_point.get_center(),
                sine_point.get_center(),
                color=GRAY,
                stroke_width=2,
                dash_length=0.1
            )
        )
        
        # Show the initial setup
        self.play(Create(unit_circle), run_time=1.5)
        self.play(Create(axes), run_time=1.5)
        self.play(Write(x_label), Write(y_label), run_time=1.5)
        
        # Add moving elements
        self.add(moving_point, sine_point, sine_wave_trace, projection_line)
        
        # Animate the point moving counter-clockwise around the unit circle
        # and trace the sine wave
        self.play(
            theta_tracker.animate.set_value(2*PI), 
            run_time=8, 
            rate_func=linear
        )
        
        # Label the sine wave
        sine_label = MathTex(r"\sin(\theta)", color=GREEN, font_size=36)
        sine_label.next_to(axes.coords_to_point(PI/2, 1), UR, buff=0.2)
        self.play(Write(sine_label), run_time=1)
        
        # Highlight the amplitude (from -1 to 1)
        amplitude_line = Line(
            axes.coords_to_point(0, -1), 
            axes.coords_to_point(0, 1), 
            color=ORANGE, 
            stroke_width=6
        )
        amplitude_brace = Brace(amplitude_line, direction=LEFT, color=ORANGE)
        amplitude_label = MathTex(r"\text{Amplitude: } -1 \text{ to } 1", color=ORANGE, font_size=28)
        amplitude_label.next_to(amplitude_brace, LEFT)
        
        self.play(Create(amplitude_line), run_time=1)
        self.play(Create(amplitude_brace), Write(amplitude_label), run_time=2)
        
        # Highlight the period (from 0 to 2π)
        period_line = Line(
            axes.coords_to_point(0, -1.3), 
            axes.coords_to_point(2*PI, -1.3), 
            color=PURPLE, 
            stroke_width=4
        )
        period_brace = Brace(period_line, direction=DOWN, color=PURPLE)
        period_label = MathTex(r"\text{Period: } 2\pi", color=PURPLE, font_size=28)
        period_label.next_to(period_brace, DOWN)
        
        self.play(Create(period_line), run_time=1)
        self.play(Create(period_brace), Write(period_label), run_time=2)
        
        # Show key points on the sine wave
        key_points_data = [
            (0, 0, r"\sin(0) = 0"),
            (PI/2, 1, r"\sin(\pi/2) = 1"),
            (PI, 0, r"\sin(\pi) = 0"),
            (3*PI/2, -1, r"\sin(3\pi/2) = -1"),
            (2*PI, 0, r"\sin(2\pi) = 0")
        ]
        
        key_point_dots = VGroup()
        key_point_labels = VGroup()
        
        for theta_val, y_val, label_text in key_points_data:
            # Create dot at key point
            key_dot = Dot(
                axes.coords_to_point(theta_val, y_val), 
                color=YELLOW, 
                radius=0.08
            )
            key_point_dots.add(key_dot)
            
            # Create label for key point
            key_label = MathTex(label_text, font_size=24, color=YELLOW)
            if y_val >= 0:
                key_label.next_to(key_dot, UP, buff=0.15)
            else:
                key_label.next_to(key_dot, DOWN, buff=0.15)
            key_point_labels.add(key_label)
        
        # Show key points
        self.play(Create(key_point_dots), run_time=1.5)
        self.play(Write(key_point_labels), run_time=2.5)
        
        # Hold the final scene
        self.wait(3)