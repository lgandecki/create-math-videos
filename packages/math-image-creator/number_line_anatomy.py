from manim import *

class NumberLineAnatomy(Scene):
    def construct(self):
        # Create the main number line
        number_line = NumberLine(
            x_range=[-6, 6, 1],
            length=10,
            color=WHITE,
            include_numbers=False,
            include_ticks=False
        )
        
        # Position the number line
        number_line.move_to(ORIGIN)
        
        # Draw the number line
        self.play(Create(number_line))
        self.wait(0.5)
        
        # Create and animate the zero (origin)
        zero_tick = Line(UP * 0.2, DOWN * 0.2, color=WHITE).move_to(number_line.number_to_point(0))
        zero_label = Text("0", font_size=24, color=YELLOW).next_to(zero_tick, DOWN, buff=0.3)
        origin_label = Text("Origin", font_size=20, color=YELLOW).next_to(zero_label, DOWN, buff=0.2)
        
        self.play(Create(zero_tick))
        self.play(Write(zero_label))
        self.play(Write(origin_label))
        self.wait(1)
        
        # Animate positive numbers (right side)
        positive_title = Text("Positive Numbers", font_size=28, color=GREEN).to_edge(UP).shift(RIGHT * 2)
        self.play(Write(positive_title))
        
        # Create positive ticks and labels
        positive_ticks = []
        positive_labels = []
        
        for i in range(1, 6):
            tick = Line(UP * 0.2, DOWN * 0.2, color=GREEN).move_to(number_line.number_to_point(i))
            label = Text(str(i), font_size=24, color=GREEN).next_to(tick, DOWN, buff=0.3)
            positive_ticks.append(tick)
            positive_labels.append(label)
        
        # Animate positive numbers appearing one by one
        for i in range(5):
            self.play(
                Create(positive_ticks[i]),
                Write(positive_labels[i]),
                run_time=0.5
            )
        
        self.wait(1)
        
        # Animate negative numbers (left side)
        negative_title = Text("Negative Numbers", font_size=28, color=RED).to_edge(UP).shift(LEFT * 2)
        self.play(Write(negative_title))
        
        # Create negative ticks and labels
        negative_ticks = []
        negative_labels = []
        
        for i in range(-1, -6, -1):
            tick = Line(UP * 0.2, DOWN * 0.2, color=RED).move_to(number_line.number_to_point(i))
            label = Text(str(i), font_size=24, color=RED).next_to(tick, DOWN, buff=0.3)
            negative_ticks.append(tick)
            negative_labels.append(label)
        
        # Animate negative numbers appearing one by one
        for i in range(5):
            self.play(
                Create(negative_ticks[i]),
                Write(negative_labels[i]),
                run_time=0.5
            )
        
        self.wait(1)
        
        # Emphasize direction concepts
        # Right arrow for increasing
        right_arrow = Arrow(
            number_line.number_to_point(1), 
            number_line.number_to_point(4), 
            color=YELLOW,
            stroke_width=6
        ).shift(UP * 1)
        
        increase_text = Text("Numbers increase →", font_size=20, color=YELLOW).next_to(right_arrow, UP, buff=0.2)
        
        self.play(Create(right_arrow))
        self.play(Write(increase_text))
        self.wait(1)
        
        # Left arrow for decreasing
        left_arrow = Arrow(
            number_line.number_to_point(-1), 
            number_line.number_to_point(-4), 
            color=ORANGE,
            stroke_width=6
        ).shift(UP * 1)
        
        decrease_text = Text("← Numbers decrease", font_size=20, color=ORANGE).next_to(left_arrow, UP, buff=0.2)
        
        self.play(Create(left_arrow))
        self.play(Write(decrease_text))
        self.wait(2)
        
        # Final pause to show complete number line
        self.wait(1)