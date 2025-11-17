from manim import *

class ComparingNumbers(Scene):
    def construct(self):
        # Create number line
        number_line = NumberLine(
            x_range=[-6, 6, 1],
            length=10,
            color=BLUE,
            include_numbers=True,
            label_direction=DOWN,
            font_size=24
        )
        
        # Title
        title = Text("Comparing Numbers", font_size=36, color=WHITE)
        title.to_edge(UP)
        
        # Position number line in center
        number_line.move_to(ORIGIN)
        
        # Display title and number line
        self.play(Write(title))
        self.play(Create(number_line))
        self.wait(1)
        
        # State the rule
        rule_text = Text(
            "Numbers on the right are always greater than numbers on the left",
            font_size=28,
            color=YELLOW
        )
        rule_text.next_to(number_line, UP, buff=0.5)
        
        self.play(Write(rule_text))
        self.wait(2)
        
        # Example 1: Positive vs. Positive (3 and 5)
        example1_title = Text("Example 1: Positive vs. Positive", font_size=24, color=GREEN)
        example1_title.next_to(rule_text, UP, buff=0.3)
        
        self.play(Write(example1_title))
        
        # Create points at +3 and +5
        point_3 = Dot(number_line.number_to_point(3), color=RED, radius=0.1)
        point_5 = Dot(number_line.number_to_point(5), color=RED, radius=0.1)
        
        label_3 = Text("+3", font_size=20, color=RED)
        label_3.next_to(point_3, UP, buff=0.2)
        
        label_5 = Text("+5", font_size=20, color=RED)
        label_5.next_to(point_5, UP, buff=0.2)
        
        self.play(Create(point_3), Write(label_3))
        self.play(Create(point_5), Write(label_5))
        
        # Arrow from +3 to +5
        arrow_3_to_5 = Arrow(
            number_line.number_to_point(3),
            number_line.number_to_point(5),
            color=ORANGE,
            buff=0.1
        )
        arrow_3_to_5.shift(DOWN * 0.5)
        
        self.play(Create(arrow_3_to_5))
        
        # Display comparison
        comparison_1 = Text("5 > 3", font_size=32, color=WHITE)
        comparison_1.next_to(number_line, DOWN, buff=1)
        
        self.play(Write(comparison_1))
        self.wait(2)
        
        # Clean up for next example
        self.play(
            FadeOut(point_3), FadeOut(point_5),
            FadeOut(label_3), FadeOut(label_5),
            FadeOut(arrow_3_to_5), FadeOut(comparison_1),
            FadeOut(example1_title)
        )
        
        # Example 2: Positive vs. Negative (-1 and +2)
        example2_title = Text("Example 2: Positive vs. Negative", font_size=24, color=GREEN)
        example2_title.next_to(rule_text, UP, buff=0.3)
        
        self.play(Write(example2_title))
        
        # Create points at -1 and +2
        point_neg1 = Dot(number_line.number_to_point(-1), color=RED, radius=0.1)
        point_pos2 = Dot(number_line.number_to_point(2), color=RED, radius=0.1)
        
        label_neg1 = Text("-1", font_size=20, color=RED)
        label_neg1.next_to(point_neg1, UP, buff=0.2)
        
        label_pos2 = Text("+2", font_size=20, color=RED)
        label_pos2.next_to(point_pos2, UP, buff=0.2)
        
        self.play(Create(point_neg1), Write(label_neg1))
        self.play(Create(point_pos2), Write(label_pos2))
        
        # Arrow from -1 to +2
        arrow_neg1_to_pos2 = Arrow(
            number_line.number_to_point(-1),
            number_line.number_to_point(2),
            color=ORANGE,
            buff=0.1
        )
        arrow_neg1_to_pos2.shift(DOWN * 0.5)
        
        self.play(Create(arrow_neg1_to_pos2))
        
        # Display comparison
        comparison_2 = Text("2 > -1", font_size=32, color=WHITE)
        comparison_2.next_to(number_line, DOWN, buff=1)
        
        self.play(Write(comparison_2))
        self.wait(2)
        
        # Clean up for next example
        self.play(
            FadeOut(point_neg1), FadeOut(point_pos2),
            FadeOut(label_neg1), FadeOut(label_pos2),
            FadeOut(arrow_neg1_to_pos2), FadeOut(comparison_2),
            FadeOut(example2_title)
        )
        
        # Example 3: Negative vs. Negative (-4 and -2)
        example3_title = Text("Example 3: Negative vs. Negative", font_size=24, color=GREEN)
        example3_title.next_to(rule_text, UP, buff=0.3)
        
        self.play(Write(example3_title))
        
        # Create points at -4 and -2
        point_neg4 = Dot(number_line.number_to_point(-4), color=RED, radius=0.1)
        point_neg2 = Dot(number_line.number_to_point(-2), color=RED, radius=0.1)
        
        label_neg4 = Text("-4", font_size=20, color=RED)
        label_neg4.next_to(point_neg4, UP, buff=0.2)
        
        label_neg2 = Text("-2", font_size=20, color=RED)
        label_neg2.next_to(point_neg2, UP, buff=0.2)
        
        self.play(Create(point_neg4), Write(label_neg4))
        self.play(Create(point_neg2), Write(label_neg2))
        
        # Arrow from -4 to -2
        arrow_neg4_to_neg2 = Arrow(
            number_line.number_to_point(-4),
            number_line.number_to_point(-2),
            color=ORANGE,
            buff=0.1
        )
        arrow_neg4_to_neg2.shift(DOWN * 0.5)
        
        self.play(Create(arrow_neg4_to_neg2))
        
        # Display comparison
        comparison_3 = Text("-2 > -4", font_size=32, color=WHITE)
        comparison_3.next_to(number_line, DOWN, buff=1)
        
        self.play(Write(comparison_3))
        self.wait(3)
        
        # Final fade out
        self.play(FadeOut(Group(*self.mobjects)))