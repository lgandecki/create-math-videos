from manim import *
import numpy as np

class GoldenRatioDemo(Scene):
    def construct(self):
        # Title
        title = Text("Złoty Podział", font_size=48, color=GOLD)
        subtitle = MathTex(r"\varphi = \frac{1 + \sqrt{5}}{2} \approx 1.618", font_size=36)
        title_group = VGroup(title, subtitle).arrange(DOWN, buff=0.3)
        
        self.play(Write(title))
        self.play(FadeIn(subtitle))
        self.wait(2)
        self.play(FadeOut(title_group))
        
        # Create golden rectangle
        golden_ratio = (1 + np.sqrt(5)) / 2
        rect_width = 5
        rect_height = rect_width / golden_ratio
        
        # Main golden rectangle
        golden_rect = Rectangle(
            width=rect_width,
            height=rect_height,
            color=GOLD,
            stroke_width=3
        )
        golden_rect.shift(LEFT * 1)
        
        # Labels for dimensions
        width_label = MathTex("a", font_size=32, color=WHITE)
        width_label.next_to(golden_rect, DOWN, buff=0.2)
        
        height_label = MathTex("b", font_size=32, color=WHITE)
        height_label.next_to(golden_rect, LEFT, buff=0.2)
        
        # Show rectangle with labels
        self.play(Create(golden_rect))
        self.play(Write(width_label), Write(height_label))
        self.wait()
        
        # Show the golden ratio equation
        ratio_equation = MathTex(
            r"\frac{a}{b} = \frac{a + b}{a} = \varphi",
            font_size=36
        )
        ratio_equation.to_edge(UP)
        self.play(Write(ratio_equation))
        self.wait()
        
        # Create square from the rectangle
        square_side = rect_height
        square = Square(
            side_length=square_side,
            color=BLUE,
            fill_opacity=0.3,
            stroke_width=3
        )
        square.move_to(golden_rect.get_left() + square_side/2 * RIGHT)
        
        # Create the remaining smaller rectangle
        small_rect_width = rect_width - square_side
        small_rect = Rectangle(
            width=small_rect_width,
            height=rect_height,
            color=GREEN,
            fill_opacity=0.3,
            stroke_width=3
        )
        small_rect.move_to(golden_rect.get_right() - small_rect_width/2 * RIGHT)
        
        # Animate the division
        self.play(
            Create(square),
            Create(small_rect),
            golden_rect.animate.set_fill(opacity=0)
        )
        self.wait()
        
        # Show that the small rectangle is also golden
        small_ratio_text = Text(
            "Ten prostokąt też jest złoty!",
            font_size=24,
            color=GREEN
        )
        small_ratio_text.next_to(small_rect, DOWN, buff=0.5)
        arrow = Arrow(
            small_ratio_text.get_top(),
            small_rect.get_bottom(),
            color=GREEN,
            buff=0.1
        )
        
        self.play(
            Write(small_ratio_text),
            Create(arrow)
        )
        self.wait(2)
        self.play(FadeOut(small_ratio_text), FadeOut(arrow))
        
        # Create Fibonacci spiral
        self.play(
            golden_rect.animate.shift(RIGHT * 3),
            square.animate.shift(RIGHT * 3),
            small_rect.animate.shift(RIGHT * 3),
            width_label.animate.shift(RIGHT * 3),
            height_label.animate.shift(RIGHT * 3)
        )
        
        # Draw the spiral
        spiral_text = Text("Spirala Fibonacciego", font_size=32, color=YELLOW)
        spiral_text.to_edge(LEFT).shift(UP)
        self.play(Write(spiral_text))
        
        # Create quarter circles for the spiral
        center1 = square.get_center()
        arc1 = Arc(
            radius=square_side,
            start_angle=PI,
            angle=-PI/2,
            color=YELLOW,
            stroke_width=3
        ).move_arc_center_to(center1)
        
        # Continue spiral in the smaller rectangle
        center2 = small_rect.get_corner(DR)
        arc2 = Arc(
            radius=small_rect_width,
            start_angle=PI/2,
            angle=-PI/2,
            color=YELLOW,
            stroke_width=3
        ).move_arc_center_to(center2)
        
        # Draw the spiral
        self.play(Create(arc1), run_time=1.5)
        self.play(Create(arc2), run_time=1)
        
        # Show golden ratio in nature
        nature_text = Text(
            "Złoty podział w naturze:",
            font_size=28,
            color=WHITE
        )
        nature_text.to_edge(DOWN, buff=2)
        
        examples = VGroup(
            Text("• Muszle ślimaków", font_size=20),
            Text("• Płatki kwiatów", font_size=20),
            Text("• Proporcje ciała", font_size=20),
            Text("• Galaktyki spiralne", font_size=20)
        ).arrange(DOWN, aligned_edge=LEFT, buff=0.2)
        examples.next_to(nature_text, DOWN, buff=0.3)
        
        self.play(Write(nature_text))
        for example in examples:
            self.play(FadeIn(example, shift=RIGHT * 0.3), run_time=0.5)
        
        self.wait(2)
        
        # Create a series of golden rectangles
        self.play(
            *[FadeOut(mob) for mob in self.mobjects]
        )
        
        # Show Fibonacci sequence connection
        fib_title = Text("Ciąg Fibonacciego → Złoty Podział", font_size=36, color=GOLD)
        fib_title.to_edge(UP)
        self.play(Write(fib_title))
        
        # Fibonacci numbers
        fib_numbers = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
        fib_display = VGroup()
        
        for i, num in enumerate(fib_numbers[:8]):
            num_text = Text(str(num), font_size=32)
            if i == 0:
                num_text.shift(LEFT * 3)
            else:
                num_text.next_to(fib_display[-1], RIGHT, buff=0.5)
            fib_display.add(num_text)
        
        self.play(Write(fib_display[0]))
        self.play(Write(fib_display[1]))
        
        # Show addition pattern
        for i in range(2, len(fib_display)):
            # Create addition visualization
            plus = Text("+", font_size=24)
            equals = Text("=", font_size=24)
            
            plus.move_to((fib_display[i-2].get_center() + fib_display[i-1].get_center()) / 2)
            equals.move_to((fib_display[i-1].get_center() + fib_display[i].get_center()) / 2)
            
            self.play(
                FadeIn(plus),
                FadeIn(equals),
                Write(fib_display[i]),
                run_time=0.7
            )
            self.play(
                FadeOut(plus),
                FadeOut(equals),
                run_time=0.3
            )
        
        # Show ratios approaching golden ratio
        ratio_text = Text("Stosunek kolejnych liczb:", font_size=24)
        ratio_text.next_to(fib_display, DOWN, buff=1)
        self.play(Write(ratio_text))
        
        ratios = VGroup()
        for i in range(3, 7):
            ratio = fib_numbers[i] / fib_numbers[i-1]
            ratio_display = MathTex(
                f"\\frac{{{fib_numbers[i]}}}{{{fib_numbers[i-1]}}} \\approx {ratio:.3f}",
                font_size=24
            )
            if i == 3:
                ratio_display.next_to(ratio_text, DOWN, buff=0.5)
            else:
                ratio_display.next_to(ratios[-1], DOWN, buff=0.2)
            ratios.add(ratio_display)
            
            self.play(Write(ratio_display), run_time=0.7)
        
        # Highlight convergence to phi
        convergence = MathTex(
            r"\rightarrow \varphi \approx 1.618",
            font_size=32,
            color=GOLD
        )
        convergence.next_to(ratios, RIGHT, buff=0.5)
        
        self.play(
            Write(convergence),
            *[ratio.animate.set_color(GOLD) for ratio in ratios]
        )
        
        # Final message
        final_message = Text(
            "Złoty podział - matematyka piękna i natury",
            font_size=32,
            color=GOLD
        )
        final_message.to_edge(DOWN)
        
        self.play(Write(final_message))
        self.wait(3)