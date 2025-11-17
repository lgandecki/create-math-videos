from manim import *
import numpy as np

class ExponentialGrowthDemo(Scene):
    def construct(self):
        # Title
        title = Text("Wzrost Wykładniczy", font_size=48, color=BLUE)
        subtitle = Text("y = 2^x", font_size=36, color=WHITE)
        title.to_edge(UP)
        subtitle.next_to(title, DOWN)
        
        self.play(Write(title))
        self.play(FadeIn(subtitle))
        self.wait()
        
        # Create axes
        axes = Axes(
            x_range=[0, 8, 1],
            y_range=[0, 256, 32],
            x_length=10,
            y_length=6,
            axis_config={
                "color": WHITE,
                "stroke_width": 2,
                "include_numbers": True,
                "font_size": 20,
            },
            tips=True,
            x_axis_config={
                "numbers_to_include": list(range(0, 9)),
            },
            y_axis_config={
                "numbers_to_include": [0, 64, 128, 192, 256],
            }
        ).shift(DOWN * 0.5)
        
        # Axis labels using the correct method
        axes_labels = axes.get_axis_labels(
            x_label=Text("x", font_size=24),
            y_label=Text("y", font_size=24)
        )
        
        # Show axes
        self.play(Create(axes), Write(axes_labels))
        self.wait()
        
        # Create exponential function
        exp_function = axes.plot(
            lambda x: 2**x,
            x_range=[0, 8],
            color=GREEN,
            stroke_width=3
        )
        
        # Create dots for key points
        points = []
        point_labels = []
        
        for x in range(0, 8):
            y = 2**x
            dot = Dot(axes.c2p(x, y), color=YELLOW, radius=0.08)
            label = MathTex(f"({x}, {y})", font_size=16)
            
            # Position labels to avoid overlap
            if x < 4:
                label.next_to(dot, UR, buff=0.1)
            else:
                label.next_to(dot, LEFT, buff=0.1)
            
            points.append(dot)
            point_labels.append(label)
        
        # Show function with animation
        self.play(Create(exp_function), run_time=2)
        self.wait()
        
        # Show points one by one with doubling explanation
        doubling_text = Text("Każdy krok podwaja wartość!", font_size=28, color=YELLOW)
        doubling_text.next_to(axes, DOWN, buff=0.5)
        
        for i, (dot, label) in enumerate(zip(points, point_labels)):
            self.play(
                FadeIn(dot, scale=1.5),
                Write(label),
                run_time=0.5
            )
            
            if i == 2:  # Show doubling text after a few points
                self.play(Write(doubling_text))
            
            if i > 0 and i < 5:  # Show doubling arrows for middle points
                prev_y = 2**(i-1)
                curr_y = 2**i
                
                arrow = CurvedArrow(
                    axes.c2p(i-1, prev_y + 5),
                    axes.c2p(i, curr_y + 5),
                    color=ORANGE,
                    stroke_width=2
                )
                
                times_2 = MathTex("\\times 2", font_size=20, color=ORANGE)
                times_2.next_to(arrow, UP, buff=0.1)
                
                self.play(
                    Create(arrow),
                    Write(times_2),
                    run_time=0.5
                )
                self.play(
                    FadeOut(arrow),
                    FadeOut(times_2),
                    run_time=0.3
                )
        
        self.wait()
        
        # Comparison with linear growth
        linear_function = axes.plot(
            lambda x: 32 * x,
            x_range=[0, 8],
            color=RED,
            stroke_width=3
        )
        linear_function.set_stroke(opacity=0.7)
        
        linear_label = Text("Wzrost liniowy", font_size=20, color=RED)
        linear_label.next_to(axes.c2p(7, 224), LEFT)
        exp_label = Text("Wzrost wykładniczy", font_size=20, color=GREEN)
        exp_label.next_to(axes.c2p(6, 64), UR)
        
        self.play(
            Create(linear_function),
            Write(linear_label),
            Write(exp_label)
        )
        
        self.wait(2)
        
        # Show the dramatic difference
        # Create a dot at the final point to surround
        final_point = Dot(axes.c2p(8, 256), color=YELLOW, radius=0.1)
        highlight_box = SurroundingRectangle(
            final_point,
            color=YELLOW,
            buff=0.2
        )
        
        difference_text = Text(
            "Wykładniczy rośnie ZNACZNIE szybciej!",
            font_size=32,
            color=YELLOW
        )
        difference_text.next_to(axes, DOWN, buff=1)
        
        self.play(
            Create(highlight_box),
            ReplacementTransform(doubling_text, difference_text)
        )
        
        self.wait(3)